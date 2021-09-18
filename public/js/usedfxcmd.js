// ---------- UsedFxCmd ----------
const usedFxCmd = () => {
  // ---------- Global ---------
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
  };

  // Handler for search commands in patterns if module was a loaded
  const handleSearchCommands = (constants, variables) => {
    const hasCommandArray = new Array(16).fill(false); // Command found boolean states
    const hasExtendedCommandArray = new Array(16).fill(false); // Extended command found boolean states

    // Get highest pattern number in pattern position table
    const getHighestPattern = (
      { songPositionOffset, positionTableLength },
      variables
    ) => {
      const { fileContent } = variables;
      for (let i = 0; i < positionTableLength; i++) {
        (variables.patternNumber =
          fileContent[songPositionOffset + i].charCodeAt(0)) >
          (variables.highestPatternNumber &&
            (variables.highestPatternNumber = variables.patternNumber));
      }
      variables.highestPatternNumber++; // Count starts at 0
    };

    // Scan for commands in Mod file
    const scanModFile = (
      constants,
      variables,
      { hasCommandArray, hasExtendedCommandArray }
    ) => {
      // Search command or extended command by number
      const searchForCommand = (
        {
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
        },
        variables,
        { hasCommandArray, hasExtendedCommandArray }
      ) => {
        const { fileContent } = variables;
        const songLength = fileContent[songLengthOffset].charCodeAt(0);
        for (let i = 0; i < songLength; i++) {
          variables.patternNumber = fileContent[songPositionOffset + i].charCodeAt(0);
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
                  (variables.commandLowbyte =
                    fileContent[commandNumberIndex].charCodeAt(0)) >
                    0 && (hasCommandArray[variables.commandNumber] = true);
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
                variables.extendedCommandNumber = fileContent[extendedCommandNumberIndex].charCodeAt(0) >> 4;
                hasExtendedCommandArray[variables.extendedCommandNumber] = true;
                hasCommandArray[14] = true; // Also set extended command boolean state
              }
            }
          }
        }
      };
      searchForCommand(
        constants,
        variables,
        { hasCommandArray, hasExtendedCommandArray }
      );
    };

    // Output command and extended command names to table
    const outputDataToTable = (
      constants,
      { hasCommandArray, hasExtendedCommandArray }
    ) => {
      // Create list entry
      const createListEntry = (tr, entryText) => {
        const td = document.createElement("td");
        td.innerHTML = entryText.toString();
        tr.append(td);
      };

      // Fill the table with used command names
      const outputUsedCommands = (
        { maxCommands, htmlElements, commandNamesTable },
        hasCommandArray, 
        createListEntry
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

      // Fill the table with used extended command names
      const outputUsedExtendedCommands = (
        { maxExtendedCommands, htmlElements, extendedCommandNamesTable },
        hasExtendedCommandArray,
        createListEntry
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

      outputUsedCommands(constants, hasCommandArray, createListEntry);
      outputUsedExtendedCommands(
        constants,
        hasExtendedCommandArray,
        createListEntry
      );
    };

    getHighestPattern(constants, variables);
    scanModFile(constants, variables, { hasCommandArray, hasExtendedCommandArray });
    outputDataToTable(constants, { hasCommandArray, hasExtendedCommandArray });
  };

  // Handler for load module if "Choose file" was clicked
  const handleLoadModule = (constants, variables) => {
    const { inputGroupFile01 } = constants.htmlElements;
    const input = inputGroupFile01.files;
    // const files = (input.length);
    const file = input[0];
    // const filename = input[0].name;
    // const filesize = input[0].size;
    // const filetype = input[0].type;
    const reader = new FileReader();
    reader.onload = (event) => (variables.fileContent = event.target.result);
    reader.readAsBinaryString(file);

    // Handler to wait until module is loaded
    const handleWaitForLoad = (constants, variables) => {
      // Remove tr/td tags from table
      const resetValues = ({ htmlElements }) => {
        const { commandsTableBody, extendedCommandsTableBody } = htmlElements;
        commandsTableBody.innerHTML = "";
        extendedCommandsTableBody.innerHTML = "";
      };

      resetValues(constants);
      handleSearchCommands(constants, variables);
      reader.removeEventListener("load", handleWaitForLoad);
    };
    // Add handler for wait until module is loaded
    reader.addEventListener("load", () =>
      handleWaitForLoad(constants, variables)
    );
  };
  // Add handler for load module if "Choose file" button was clicked
  constants.htmlElements.inputGroupFile01.addEventListener("change", () =>
    handleLoadModule(constants, variables)
  );
};

// Add handler for UsedFxCmd
document.addEventListener("DOMContentLoaded", usedFxCmd, false);
