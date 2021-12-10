const handleSearchFxCmd = () => {
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
    commandNumberMask: 0xf,
    // HTML element objects
    htmlElements: {
      inputGroupFile01: document.querySelector("#inputGroupFile01"),
      commandSelect: document.querySelector("#commandSelect"),
      extendedCommandSelect: document.querySelector("#extendedCommandSelect"),
      commandSearchContainer: document.querySelector("#commandSearchContainer"),
      extendedCommandSearchContainer: document.querySelector(
        "#extendedCommandSearchContainer"
      ),
      tableBody: document.querySelector("#tableBody"),
      groupChange: document.querySelectorAll(".groupChange"),
    },
    // Key codes 0...f for command hex numbers 0...f
    shortkeyHTMLCodes: [
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102,
    ],
    // Index for command and extended command hex numbers 0...f
    shortkeyIndexTable: [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
    ],
  };

  // Initialize missing song constant values
  const { maxPatternPosition, maxChannels, noteDataLength } = constants;
  constants.patternLength = maxPatternPosition * maxChannels;
  constants.patternRowLength = noteDataLength * maxChannels;

  const variables = {
    isFileLoaded: false,
    fileContent: "",
    patternNumber: 0,
    highestPatternNumber: 0,
    commandNumber: 0,
    extendedCommandNumber: 0,
    commandLowbyte: 0,
    searchCommandNumber: 0,
    searchExtendedCommandNumber: 0,
    handleSearchCommandCallback: null,
    handleWaitForModuleLoadCallback: null,
    handleLoadTrackerModuleCallback: null,
    handleCheckCommandCallback: null,
    handleCheckExtendedCommandCallback: null,
    handleGetKeyCommandCallback: null,
    handleSetCommandByPressedKeyCallback: null,
    handleMouseLeaveCommandCallback: null,
    handleGetKeyExtendedCommandCallback: null,
    handleSetExtendedCommandByPressedKeyCallback: null,
    handleMouseLeaveExtendedCommandCallback: null,
  };

  const handleSearchCommand = ({ constants, variables }) => {
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

    const convertInputElementValues = ({ constants, variables }) => {
      const { commandSelect, extendedCommandSelect } = constants.htmlElements;
      variables.searchCommandNumber = parseInt(commandSelect.value);
      variables.searchExtendedCommandNumber = parseInt(
        extendedCommandSelect.value
      );
    };

    const scanForCommandsInModFile = ({ constants, variables }) => {
      const searchForCommandByNumber = ({ constants, variables }) => {
        const outputSongDataToTable = (
          { constants, variables },
          { i, j, k }
        ) => {
          const { noteDataLength, patternRowLength, htmlElements } = constants;
          const createListEntry = (tr, entryText) => {
            const td = document.createElement("td");
            td.innerHTML = entryText.toString();
            tr.append(td);
          };

          const tr = document.createElement("tr");
          htmlElements.tableBody.append(tr);
          createListEntry(tr, i); // Position number
          createListEntry(tr, variables.patternNumber); // Pattern number
          createListEntry(tr, j / patternRowLength); // Pattern row number
          createListEntry(tr, k / noteDataLength); // Channel number
        };

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
              variables.commandNumber =
                fileContent[commandNumberIndex].charCodeAt(0) &
                commandNumberMask; // Mask out upper nibble
              if (
                variables.commandNumber === variables.searchCommandNumber &&
                variables.commandNumber !== 14
              ) {
                if (
                  variables.commandNumber === 0 &&
                  variables.searchCommandNumber === 0
                ) {
                  const commandNumberIndex =
                    patternStartOffset +
                    patternOffset +
                    j +
                    k +
                    commandLowbyteOffset;
                  variables.commandLowbyte =
                    variables.fileContent[commandNumberIndex].charCodeAt(0);
                  if (variables.commandLowbyte > 0) {
                    outputSongDataToTable(
                      { constants, variables },
                      { i, j, k }
                    );
                  }
                } else {
                  outputSongDataToTable({ constants, variables }, { i, j, k });
                }
              }
              if (variables.commandNumber === 14) {
                const extendedCommandNumberIndex =
                  patternStartOffset +
                  patternOffset +
                  j +
                  k +
                  commandLowbyteOffset;
                variables.extendedCommandNumber =
                  variables.fileContent[extendedCommandNumberIndex].charCodeAt(
                    0
                  ) >> 4;
                if (
                  variables.extendedCommandNumber ===
                  variables.searchExtendedCommandNumber
                ) {
                  outputSongDataToTable({ constants, variables }, { i, j, k });
                }
              }
            }
          }
        }
      };

      const { htmlElements } = constants;
      const { tableBody } = htmlElements;
      if (variables.searchCommandNumber !== -1) {
        tableBody.innerHTML = ""; // Remove <tr>/<td> tags from table
        searchForCommandByNumber({ constants, variables });
      }
    };

    if (variables.isFileLoaded) {
      getHighestSongPattern({ constants, variables });
      convertInputElementValues({ constants, variables });
      scanForCommandsInModFile({ constants, variables });
    }
  };

  const handleLoadTrackerModule = ({ constants, variables }) => {
    const handleWaitForModuleLoad = ({ constants, variables }) => {
      const resetValues = ({ constants, variables }) => {
        const { commandSelect, extendedCommandSelect, tableBody } =
          constants.htmlElements;
        commandSelect.value = "-1";
        extendedCommandSelect.value = "-1";
        tableBody.innerHTML = ""; // Remove tr/td tags from table
        variables.isFileLoaded = true;
      };

      resetValues({ constants, variables });
      reader.removeEventListener(
        "load",
        variables.handleWaitForModuleLoadCallback
      );
    };

    const addWaitForModuleLoadHandler = (handleWaitForModuleLoad) => {
      variables.handleWaitForModuleLoadCallback = () => {
        handleWaitForModuleLoad({ constants, variables });
      };

      reader.addEventListener(
        "load",
        variables.handleWaitForModuleLoadCallback
      );
    };

    variables.isFileLoaded = false;
    const { inputGroupFile01 } = constants.htmlElements;
    const input = inputGroupFile01.files;
    const file = input[0];
    const reader = new FileReader();
    reader.onload = (event) => (variables.fileContent = event.target.result);
    reader.readAsBinaryString(file);
    addWaitForModuleLoadHandler(handleWaitForModuleLoad);
  };

  const addLoadTrackerModuleHandler = (handleLoadTrackerModule) => {
    variables.handleLoadTrackerModuleCallback = () => {
      handleLoadTrackerModule({ constants, variables });
    };

    constants.htmlElements.inputGroupFile01.addEventListener(
      "change",
      variables.handleLoadTrackerModuleCallback
    );
  };

  addLoadTrackerModuleHandler(handleLoadTrackerModule);

  const handleCheckCommand = ({ constants, variables }) => {
    const { commandSelect, extendedCommandSelect } = constants.htmlElements;
    commandSelect.value === "14"
      ? (extendedCommandSelect.value = "0")
      : (extendedCommandSelect.value = "-1");
    handleSearchCommand({ constants, variables });
  };

  const addCheckCommandHandler = (handleCheckCommand) => {
    variables.handleCheckCommandCallback = () => {
      handleCheckCommand({ constants, variables });
    };

    constants.htmlElements.commandSelect.addEventListener(
      "change",
      variables.handleCheckCommandCallback
    );
  };

  addCheckCommandHandler(handleCheckCommand);

  const handleCheckExtendedCommand = ({ constants, variables }) => {
    const { commandSelect, extendedCommandSelect } = constants.htmlElements;
    extendedCommandSelect.value === "-1"
      ? (commandSelect.value = "-1")
      : (commandSelect.value = "14");
    handleSearchCommand({ constants, variables });
  };

  const addCheckExtendedCommandHandler = (handleCheckExtendedCommand) => {
    variables.handleCheckExtendedCommandCallback = () => {
      handleCheckExtendedCommand({ constants, variables });
    };

    constants.htmlElements.extendedCommandSelect.addEventListener(
      "change",
      variables.handleCheckExtendedCommandCallback
    );
  };

  addCheckExtendedCommandHandler(handleCheckExtendedCommand);

  const handleSetCommandByPressedKey = ({ constants, variables }) => {
    const handleGetKeyCommand = (
      { which, keyCode },
      { constants, variables }
    ) => {
      const { shortkeyHTMLCodes, shortkeyIndexTable, htmlElements } = constants;
      const { commandSelect, extendedCommandSelect } = htmlElements;
      const pressedKeyHTMLCode = which || keyCode;
      for (let i = 0; i < shortkeyHTMLCodes.length; i++) {
        if (shortkeyHTMLCodes[i] === pressedKeyHTMLCode) {
          (commandSelect.value = shortkeyIndexTable[i]) === "14"
            ? (extendedCommandSelect.value = "0")
            : (extendedCommandSelect.value = "-1");
          break;
        }
      }
      handleSearchCommand({ constants, variables });
    };

    const addGetKeyCommandHandler = (handleGetKeyCommand) => {
      variables.handleGetKeyCommandCallback = (event) => {
        handleGetKeyCommand(event, { constants, variables });
      };

      commandSearchContainer.addEventListener(
        "keypress",
        variables.handleGetKeyCommandCallback
      );
    };

    const { commandSearchContainer } = constants.htmlElements;
    commandSearchContainer.focus();
    addGetKeyCommandHandler(handleGetKeyCommand);
  };

  const addCommandByPressedKeyHandler = (handleSetCommandByPressedKey) => {
    variables.handleSetCommandByPressedKeyCallback = () => {
      handleSetCommandByPressedKey({ constants, variables });
    };

    constants.htmlElements.commandSearchContainer.addEventListener(
      "mouseenter",
      variables.handleSetCommandByPressedKeyCallback
    );
  };

  addCommandByPressedKeyHandler(handleSetCommandByPressedKey);

  const handleMouseLeaveCommand = ({ constants, variables }) => {
    const { commandSearchContainer } = constants.htmlElements;
    commandSearchContainer.blur();
    commandSearchContainer.removeEventListener(
      "keypress",
      variables.handleGetKeyCommandCallback
    );
  };

  const addMouseLeaveCommandHandler = (handleMouseLeaveCommand) => {
    variables.handleMouseLeaveCommandCallback = () => {
      handleMouseLeaveCommand({ constants, variables });
    };

    constants.htmlElements.commandSearchContainer.addEventListener(
      "mouseleave",
      variables.handleMouseLeaveCommandCallback
    );
  };

  addMouseLeaveCommandHandler(handleMouseLeaveCommand);

  const handleSetExtendedCommandByPressedKey = ({ constants, variables }) => {
    const handleGetKeyExtendedCommand = (
      { which, keyCode },
      { constants, variables }
    ) => {
      const { shortkeyHTMLCodes, shortkeyIndexTable, htmlElements } = constants;
      const { commandSelect, extendedCommandSelect } = htmlElements;
      const pressedKeyHTMLCode = which || keyCode;
      for (let i = 0; i < shortkeyHTMLCodes.length; i++) {
        if (shortkeyHTMLCodes[i] === pressedKeyHTMLCode) {
          extendedCommandSelect.value = shortkeyIndexTable[i];
          commandSelect.value = "14";
          break;
        }
      }
      handleSearchCommand({ constants, variables });
    };

    const addGetKeyExtendedCommandHandler = (handleGetKeyExtendedCommand) => {
      variables.handleGetKeyExtendedCommandCallback = (event) => {
        handleGetKeyExtendedCommand(event, { constants, variables });
      };

      extendedCommandSearchContainer.addEventListener(
        "keypress",
        variables.handleGetKeyExtendedCommandCallback
      );
    };

    const { extendedCommandSearchContainer } = constants.htmlElements;
    extendedCommandSearchContainer.focus();
    addGetKeyExtendedCommandHandler(handleGetKeyExtendedCommand);
  };

  const addSetExtendedCommandByPressedKeyHandler = (
    handleSetExtendedCommandByPressedKey
  ) => {
    variables.handleSetExtendedCommandByPressedKeyCallback = () => {
      handleSetExtendedCommandByPressedKey({ constants, variables });
    };

    constants.htmlElements.extendedCommandSearchContainer.addEventListener(
      "mouseenter",
      variables.handleSetExtendedCommandByPressedKeyCallback
    );
  };

  addSetExtendedCommandByPressedKeyHandler(
    handleSetExtendedCommandByPressedKey
  );

  const handleMouseLeaveExtendedCommand = ({ constants, variables }) => {
    const { extendedCommandSearchContainer } = constants.htmlElements;
    extendedCommandSearchContainer.blur();
    extendedCommandSearchContainer.removeEventListener(
      "keypress",
      variables.handleGetKeyExtendedCommandCallback
    );
  };

  const addMouseLeaveExtendedCommandHandler = (
    handleMouseLeaveExtendedCommand
  ) => {
    variables.handleMouseLeaveExtendedCommandCallback = () => {
      handleMouseLeaveExtendedCommand({ constants, variables });
    };

    constants.htmlElements.extendedCommandSearchContainer.addEventListener(
      "mouseleave",
      variables.handleMouseLeaveExtendedCommandCallback
    );
  };

  addMouseLeaveExtendedCommandHandler(handleMouseLeaveExtendedCommand);
};

const addSearchFxCmdHandler = (handleSearchFxCmd) => {
  document.addEventListener("DOMContentLoaded", handleSearchFxCmd, false);
};

addSearchFxCmdHandler(handleSearchFxCmd);
