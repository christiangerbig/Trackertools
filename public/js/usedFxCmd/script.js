const handleUsedFxCmd = () => {
  const constants = {
    // Song structure offsets
    songLengthOffset: 950,
    songPositionOffset: 952,
    patternStartOffset: 1084,
    commandOffset: 2,
    commandLowbyteOffset: 3,
    // Song constant values
    amountOfPositions: 128,
    maxPatternPosition: 64,
    maxChannels: 4,
    patternLength: 0, // will be initialized later
    noteDataLength: 4,
    patternRowLength: 0, // will be initialized later
    commandNumberMask: 0xf,
    // HTML element objects
    htmlElements: {
      inputGroupFile01: document.querySelector("#inputGroupFile01"),
      commandsTableBody: document.querySelector("#commandsTableBody"),
      extendedCommandsTableBody: document.querySelector(
        "#extendedCommandsTableBody"
      ),
    },
    CommandNames: [
      "0 - Arpeggio",
      "1 - Portamento Up",
      "2 - Portamento Down",
      "3 - Tone Portamento",
      "4 - Vibrato",
      "5 - Tone Porta & Vol Slide",
      "6 - Vib & Vol Slide",
      "7 - Tremolo",
      "8 - NOT USED / custom",
      "9 - Set Sample Offset",
      "A - Volume Slide",
      "B - Position Jump",
      "C - Set Volume",
      "D - Pattern Break",
      "E - Ext commands",
      "F - Set Speed",
    ],
    extendedCommandNames: [
      "E0 - Set Filter",
      "E1 - Fine Porta Up",
      "E2 - Fine Porta Down",
      "E3 - Set Gliss Control",
      "E4 - Set Vib Waveform",
      "E5 - Set Samp Finetune",
      "E6 - Jump to Loop",
      "E7 - Set Trem Waveform",
      "E8 - Karplus Strong",
      "E9 - Retrig Note",
      "EA - Fine Vol Slide Up",
      "EB - Fine Vol Slide Down",
      "EC - Note Cut",
      "ED - Note Delay",
      "EE - Pattern Delay",
      "EF - Invert Loop",
    ],
  };

  // Initialize missing song constant values
  const { maxPatternPosition, maxChannels, noteDataLength } = constants;
  constants.patternLength = maxPatternPosition * maxChannels;
  constants.patternRowLength = noteDataLength * maxChannels;

  const variables = {
    isFileLoaded: false,
    fileContent: "",
    handleWaitFileLoadingCallback: null,
    handleLoadFileCallback: null,
  };

  const handleSearchCommands = ({ constants, variables }) => {
    const highestSongPattern = ({ constants, variables }) => {
      const { songPositionOffset, amountOfPositions } = constants;
      const { fileContent } = variables;
      let patternNumber = 0;
      let highestPatternNumber = 0;
      for (let i = 0; i < amountOfPositions; i++) {
        patternNumber = fileContent[songPositionOffset + i].charCodeAt(0);
        if (patternNumber > highestPatternNumber) {
          highestPatternNumber = patternNumber;
        }
      }
      return highestPatternNumber++; // Count starts at 0
    };

    const scanCommandsInFile = (
      { hasCommandArray, hasExtendedCommandArray },
      { constants, variables }
    ) => {
      const searchForCommands = (
        { hasCommandArray, hasExtendedCommandArray },
        { constants, variables }
      ) => {
        const {
          songLengthOffset,
          songPositionOffset,
          patternStartOffset,
          commandOffset,
          commandLowbyteOffset,
          maxPatternPosition,
          maxChannels,
          patternLength,
          noteDataLength,
          patternRowLength,
          commandNumberMask,
        } = constants;
        const { fileContent } = variables;
        const songLength = fileContent[songLengthOffset].charCodeAt(0);
        let patternNumber = 0;
        // Fetch pattern numbers
        for (
          let songPositionIndexCounter = 0;
          songPositionIndexCounter < songLength;
          songPositionIndexCounter++
        ) {
          patternNumber =
            fileContent[
              songPositionOffset + songPositionIndexCounter
            ].charCodeAt(0);
          const patternOffset = patternNumber * patternLength * noteDataLength; // Pattern offset in song structure
          // Fetch pattern rows
          for (
            let patternRowIndexCounter = 0;
            patternRowIndexCounter < maxPatternPosition;
            patternRowIndexCounter += 1
          ) {
            const patternRowOffset = patternRowIndexCounter * patternRowLength;
            let commandNumber = 0;
            let extendedCommandNumber = 0;
            let commandLowbyte = 0;
            // Fetch note data
            for (
              let noteDataIndexCounter = 0;
              noteDataIndexCounter < maxChannels;
              noteDataIndexCounter += 1
            ) {
              const noteDataOffset = noteDataIndexCounter * noteDataLength;
              const commandNumberOffset =
                patternStartOffset +
                patternOffset +
                patternRowOffset +
                noteDataOffset +
                commandOffset;
              commandNumber =
                fileContent[commandNumberOffset].charCodeAt(0) &
                commandNumberMask; // Mask out upper nibble
              if (commandNumber !== 14) {
                if (commandNumber === 0) {
                  const commandNumberOffset =
                    patternStartOffset +
                    patternOffset +
                    patternRowOffset +
                    noteDataOffset +
                    commandOffset;
                  commandLowbyte =
                    fileContent[commandNumberOffset].charCodeAt(0);
                  if (commandLowbyte > 0) {
                    hasCommandArray[commandNumber] = true;
                  }
                } else {
                  hasCommandArray[commandNumber] = true;
                }
              } else {
                const extendedCommandNumberOffset =
                  patternStartOffset +
                  patternOffset +
                  patternRowOffset +
                  noteDataOffset +
                  commandLowbyteOffset;
                extendedCommandNumber =
                  fileContent[extendedCommandNumberOffset].charCodeAt(0) >> 4;
                hasExtendedCommandArray[extendedCommandNumber] = true;
                hasCommandArray[14] = true; // Also set extended command boolean state
              }
            }
          }
        }
      };

      searchForCommands(
        { hasCommandArray, hasExtendedCommandArray },
        { constants, variables }
      );
    };

    const createUsedCommandsTable = (
      { hasCommandArray, hasExtendedCommandArray },
      constants
    ) => {
      const createListEntry = (tr, entry) => {
        const td = document.createElement("td");
        td.innerHTML = entry;
        tr.append(td);
      };

      const printUsedCommands = (
        hasCommandArray,
        { htmlElements, CommandNames }
      ) => {
        for (let i = 0; i < hasCommandArray.length; i++) {
          if (hasCommandArray[i]) {
            const tr = document.createElement("tr");
            tr.classList.add("text-left");
            htmlElements.commandsTableBody.append(tr);
            createListEntry(tr, CommandNames[i]);
          }
        }
      };

      const printUsedExtendedCommands = (
        hasExtendedCommandArray,
        { htmlElements, extendedCommandNames }
      ) => {
        for (let i = 0; i < hasExtendedCommandArray.length; i++) {
          if (hasExtendedCommandArray[i]) {
            const tr = document.createElement("tr");
            tr.classList.add("text-left");
            htmlElements.extendedCommandsTableBody.append(tr);
            createListEntry(tr, extendedCommandNames[i]);
          }
        }
      };

      printUsedCommands(hasCommandArray, constants);
      printUsedExtendedCommands(hasExtendedCommandArray, constants);
    };

    const hasCommandArray = new Array(16).fill(false); // Command found boolean states
    const hasExtendedCommandArray = new Array(16).fill(false); // Extended command found boolean states
    const { isFileLoaded } = variables;
    if (isFileLoaded) {
      variables.highestPatternNumber = highestSongPattern({
        constants,
        variables,
      });
      scanCommandsInFile(
        { hasCommandArray, hasExtendedCommandArray },
        { constants, variables }
      );
      createUsedCommandsTable(
        { hasCommandArray, hasExtendedCommandArray },
        constants
      );
    }
  };

  const handleLoadFile = ({ constants, variables }) => {
    const handleWaitFileLoading = (reader, { constants, variables }) => {
      const clearUsedCommandsTables = ({ htmlElements }) => {
        const { commandsTableBody, extendedCommandsTableBody } = htmlElements;
        commandsTableBody.innerHTML = "";
        extendedCommandsTableBody.innerHTML = "";
      };

      variables.isFileLoaded = true;
      clearUsedCommandsTables(constants);
      handleSearchCommands({ constants, variables });
      reader.removeEventListener(
        "load",
        variables.handleWaitFileLoadingCallback
      );
    };

    const addWaitFileLoadingHandler = (
      reader,
      handleWaitFileLoading,
      { constants, variables }
    ) => {
      variables.handleWaitFileLoadingCallback = () => {
        handleWaitFileLoading(reader, { constants, variables });
      };

      reader.addEventListener("load", variables.handleWaitFileLoadingCallback);
    };

    variables.isFileLoaded = false;
    const { inputGroupFile01 } = constants.htmlElements;
    const input = inputGroupFile01.files;
    const file = input[0];
    const reader = new FileReader();
    reader.onload = ({ target }) => (variables.fileContent = target.result);
    reader.readAsBinaryString(file);
    addWaitFileLoadingHandler(reader, handleWaitFileLoading, {
      constants,
      variables,
    });
  };

  const addLoadFileHandler = (handleLoadFile, { constants, variables }) => {
    variables.handleLoadFileCallback = () => {
      handleLoadFile({ constants, variables });
    };

    const { inputGroupFile01 } = constants.htmlElements;
    inputGroupFile01.addEventListener(
      "change",
      variables.handleLoadFileCallback
    );
  };

  addLoadFileHandler(handleLoadFile, {
    constants,
    variables,
  });
};

const addUsedFxCmdHandler = (handleUsedFxCmd) => {
  document.addEventListener("DOMContentLoaded", handleUsedFxCmd, false);
};

addUsedFxCmdHandler(handleUsedFxCmd);
