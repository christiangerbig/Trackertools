const handleUsedFxCmd = () => {
  const constants = {
    // Song structure offsets
    songLengthOffset: 950,
    songPositionOffset: 952,
    patternStartOffset: 1084,
    commandOffset: 2,
    commandLowbyteOffset: 3,
    // Song constant values
    positionTableLength: 128,
    maxPatternPosition: 64,
    maxChannels: 4,
    patternLength: 0, // will be initialized later
    noteDataLength: 4,
    patternRowLength: 0, // will be initialized later
    maxCommands: 16,
    maxExtendedCommands: 16,
    commandNumberMask: 0xf,
    // HTML element objects
    htmlElements: {
      inputGroupFile01: document.querySelector("#inputGroupFile01"),
      commandsTableBody: document.querySelector("#commandsTableBody"),
      extendedCommandsTableBody: document.querySelector(
        "#extendedCommandsTableBody"
      ),
    },
    // Command names
    commandNamesTable: [
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
    // Extended command names
    extendedCommandNamesTable: [
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
    fileContent: "",
    patternNumber: 0,
    highestPatternNumber: 0,
    commandNumber: 0,
    extendedCommandNumber: 0,
    commandLowbyte: 0,
    handleWaitForLoadCallback: null,
    handleLoadModuleCallback: null,
  };

  const handleSearchCommands = ({ constants, variables }) => {
    const getHighestSongPattern = ({ constants, variables }) => {
      const { songPositionOffset, positionTableLength } = constants;
      const { fileContent } = variables;
      for (let i = 0; i < positionTableLength; i++) {
        variables.patternNumber =
          fileContent[songPositionOffset + i].charCodeAt(0);
        if (variables.patternNumber > variables.highestPatternNumber) {
          variables.highestPatternNumber = variables.patternNumber;
        }
      }
      variables.highestPatternNumber++; // Count starts at 0
    };

    const scanForCommandsInModFile = (
      { constants, variables },
      { hasCommandArray, hasExtendedCommandArray }
    ) => {
      const searchForCommands = (
        { constants, variables },
        { hasCommandArray, hasExtendedCommandArray }
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
        for (let i = 0; i < songLength; i++) {
          variables.patternNumber =
            fileContent[songPositionOffset + i].charCodeAt(0);
          const patternOffset =
            variables.patternNumber * patternLength * noteDataLength; // Pattern offset in song structure
          for (
            let j = 0;
            j < maxPatternPosition * patternRowLength;
            j += patternRowLength
          ) {
            // 16th steps per row
            for (
              let k = 0;
              k < maxChannels * noteDataLength;
              k += noteDataLength
            ) {
              // 4th steps per channel
              const commandNumberIndex =
                patternStartOffset + patternOffset + j + k + commandOffset;
              if (
                (variables.commandNumber =
                  fileContent[commandNumberIndex].charCodeAt(0) &
                  commandNumberMask) !== 14
              ) {
                if (variables.commandNumber === 0) {
                  const commandNumberIndex =
                    patternStartOffset +
                    patternOffset +
                    j +
                    k +
                    commandLowbyteOffset;
                  variables.commandLowbyte =
                    fileContent[commandNumberIndex].charCodeAt(0);
                  if (variables.commandLowbyte > 0) {
                    hasCommandArray[variables.commandNumber] = true;
                  }
                } else {
                  hasCommandArray[variables.commandNumber] = true;
                }
              } else {
                const extendedCommandNumberIndex =
                  patternStartOffset +
                  patternOffset +
                  j +
                  k +
                  commandLowbyteOffset;
                variables.extendedCommandNumber =
                  fileContent[extendedCommandNumberIndex].charCodeAt(0) >> 4;
                hasExtendedCommandArray[variables.extendedCommandNumber] = true;
                hasCommandArray[14] = true; // Also set extended command boolean state
              }
            }
          }
        }
      };

      searchForCommands(
        { constants, variables },
        { hasCommandArray, hasExtendedCommandArray }
      );
    };

    const outputSongDataToTable = (
      constants,
      { hasCommandArray, hasExtendedCommandArray }
    ) => {
      const createListEntry = (tr, entryText) => {
        const td = document.createElement("td");
        td.innerHTML = entryText.toString();
        tr.append(td);
      };

      const outputUsedCommands = (
        { maxCommands, htmlElements, commandNamesTable },
        hasCommandArray
      ) => {
        for (let i = 0; i < maxCommands; i++) {
          if (hasCommandArray[i]) {
            const tr = document.createElement("tr");
            tr.classList.add("text-left");
            htmlElements.commandsTableBody.append(tr);
            createListEntry(tr, commandNamesTable[i]);
          }
        }
      };

      const outputUsedExtendedCommands = (
        { maxExtendedCommands, htmlElements, extendedCommandNamesTable },
        hasExtendedCommandArray
      ) => {
        for (let i = 0; i < maxExtendedCommands; i++) {
          if (hasExtendedCommandArray[i]) {
            const tr = document.createElement("tr");
            tr.classList.add("text-left");
            htmlElements.extendedCommandsTableBody.append(tr);
            createListEntry(tr, extendedCommandNamesTable[i]);
          }
        }
      };

      outputUsedCommands(constants, hasCommandArray);
      outputUsedExtendedCommands(constants, hasExtendedCommandArray);
    };

    const hasCommandArray = new Array(16).fill(false); // Command found boolean states
    const hasExtendedCommandArray = new Array(16).fill(false); // Extended command found boolean states
    getHighestSongPattern({ constants, variables });
    scanForCommandsInModFile(
      { constants, variables },
      { hasCommandArray, hasExtendedCommandArray }
    );
    outputSongDataToTable(constants, {
      hasCommandArray,
      hasExtendedCommandArray,
    });
  };

  const handleLoadModule = ({ constants, variables }) => {
    const handleWaitForLoad = ({ constants, variables }) => {
      const resetValues = ({ htmlElements }) => {
        const { commandsTableBody, extendedCommandsTableBody } = htmlElements;
        commandsTableBody.innerHTML = "";
        extendedCommandsTableBody.innerHTML = "";
      };

      resetValues(constants);
      handleSearchCommands({ constants, variables });
      reader.removeEventListener("load", handleWaitForLoad);
    };

    const addHandleWaitForLoadEventListener = (handleWaitForLoad) => {
      variables.handleWaitForLoadCallback = () => {
        handleWaitForLoad({ constants, variables });
      };

      const { inputGroupFile01 } = constants.htmlElements;
      const input = inputGroupFile01.files;
      const file = input[0];
      const reader = new FileReader();
      reader.onload = (event) => (variables.fileContent = event.target.result);
      reader.readAsBinaryString(file);
      reader.addEventListener("load", variables.handleWaitForLoadCallback);
    };

    addHandleWaitForLoadEventListener(handleWaitForLoad);
  };

  const addHandleLoadModuleEventListener = (handleLoadModule) => {
    variables.handleLoadModuleCallback = () => {
      handleLoadModule({ constants, variables });
    };

    constants.htmlElements.inputGroupFile01.addEventListener(
      "change",
      variables.handleLoadModuleCallback
    );
  };

  addHandleLoadModuleEventListener(handleLoadModule);
};

const addHandleUsedFxCmdEventListener = (handleUsedFxCmd) => {
  document.addEventListener("DOMContentLoaded", handleUsedFxCmd, false);
};

addHandleUsedFxCmdEventListener(handleUsedFxCmd);
