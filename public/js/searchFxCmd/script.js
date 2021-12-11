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
    handleWaitFileLoadingCallback: null,
    handleLoadFileCallback: null,
    handleCheckCommandCallback: null,
    handleCheckExtendedCommandCallback: null,
    handleGetCommandCallback: null,
    handleSetCommandCallback: null,
    handleMouseLeaveCommandCallback: null,
    handleGetExtendedCommandCallback: null,
    handleSetExtendedCommandCallback: null,
    handleMouseLeaveExtendedCommandCallback: null,
  };

  const clearSongDataTable = ({ htmlElements }) => {
    const { tableBody } = htmlElements;
    tableBody.innerHTML = "";
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

    const scanCommandsInFile = ({ constants, variables }) => {
      const searchForCommandByNumber = ({ constants, variables }) => {
        const createSongDataTable = ({ i, j, k }, { constants, variables }) => {
          const createListEntry = (tr, entry) => {
            const td = document.createElement("td");
            td.innerHTML = entry.toString();
            tr.append(td);
          };

          const { noteDataLength, patternRowLength, htmlElements } = constants;
          const tr = document.createElement("tr");
          htmlElements.tableBody.append(tr);
          const positionNumber = i;
          createListEntry(tr, positionNumber);
          const { patternNumber } = variables;
          createListEntry(tr, patternNumber);
          const patternRowNumber = j / patternRowLength;
          createListEntry(tr, patternRowNumber);
          const channelNumber = k / noteDataLength;
          createListEntry(tr, channelNumber);
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
                    createSongDataTable({ i, j, k }, { constants, variables });
                  }
                } else {
                  createSongDataTable({ i, j, k }, { constants, variables });
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
                  createSongDataTable({ i, j, k }, { constants, variables });
                }
              }
            }
          }
        }
      };

      const { htmlElements } = constants;
      const { tableBody } = htmlElements;
      if (variables.searchCommandNumber !== -1) {
        clearSongDataTable(constants);
        searchForCommandByNumber({ constants, variables });
      }
    };

    if (variables.isFileLoaded) {
      getHighestSongPattern({ constants, variables });
      convertInputElementValues({ constants, variables });
      scanCommandsInFile({ constants, variables });
    }
  };

  const handleLoadFile = ({ constants, variables }) => {
    const handleWaitFileLoading = (
      reader,
      { constants, variables }
    ) => {
      const resetValues = ({ constants, variables }) => {
        const { commandSelect, extendedCommandSelect, tableBody } =
          constants.htmlElements;
        commandSelect.value = "-1";
        extendedCommandSelect.value = "-1";
        variables.isFileLoaded = true;
      };

      resetValues({ constants, variables });
      clearSongDataTable(constants);
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

      reader.addEventListener(
        "load",
        variables.handleWaitFileLoadingCallback
      );
    };

    variables.isFileLoaded = false;
    const { inputGroupFile01 } = constants.htmlElements;
    const input = inputGroupFile01.files;
    const file = input[0];
    const reader = new FileReader();
    reader.onload = (event) => (variables.fileContent = event.target.result);
    reader.readAsBinaryString(file);
    addWaitFileLoadingHandler(reader, handleWaitFileLoading, {
      constants,
      variables,
    });
  };

  const addLoadFileHandler = (
    handleLoadFile,
    { constants, variables }
  ) => {
    variables.handleLoadFileCallback = () => {
      handleLoadFile({ constants, variables });
    };

    constants.htmlElements.inputGroupFile01.addEventListener(
      "change",
      variables.handleLoadFileCallback
    );
  };

  addLoadFileHandler(handleLoadFile, {
    constants,
    variables,
  });

  const handleCheckCommand = ({ constants, variables }) => {
    const { commandSelect, extendedCommandSelect } = constants.htmlElements;
    commandSelect.value === "14"
      ? (extendedCommandSelect.value = "0")
      : (extendedCommandSelect.value = "-1");
    handleSearchCommand({ constants, variables });
  };

  const addCheckCommandHandler = (
    handleCheckCommand,
    { constants, variables }
  ) => {
    variables.handleCheckCommandCallback = () => {
      handleCheckCommand({ constants, variables });
    };

    constants.htmlElements.commandSelect.addEventListener(
      "change",
      variables.handleCheckCommandCallback
    );
  };

  addCheckCommandHandler(handleCheckCommand, { constants, variables });

  const handleCheckExtendedCommand = ({ constants, variables }) => {
    const { commandSelect, extendedCommandSelect } = constants.htmlElements;
    extendedCommandSelect.value === "-1"
      ? (commandSelect.value = "-1")
      : (commandSelect.value = "14");
    handleSearchCommand({ constants, variables });
  };

  const addCheckExtendedCommandHandler = (
    handleCheckExtendedCommand,
    { constants, variables }
  ) => {
    variables.handleCheckExtendedCommandCallback = () => {
      handleCheckExtendedCommand({ constants, variables });
    };

    constants.htmlElements.extendedCommandSelect.addEventListener(
      "change",
      variables.handleCheckExtendedCommandCallback
    );
  };

  addCheckExtendedCommandHandler(handleCheckExtendedCommand, {
    constants,
    variables,
  });

  const handleSetCommand = ({ constants, variables }) => {
    const handleGetCommand = ({ which, keyCode }, { constants, variables }) => {
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

    const addGetCommandHandler = (
      handleGetCommand,
      { constants, variables }
    ) => {
      variables.handleGetCommandCallback = (event) => {
        handleGetCommand(event, { constants, variables });
      };

      commandSearchContainer.addEventListener(
        "keypress",
        variables.handleGetCommandCallback
      );
    };

    const { commandSearchContainer } = constants.htmlElements;
    commandSearchContainer.focus();
    addGetCommandHandler(handleGetCommand, { constants, variables });
  };

  const addCommandHandler = (handleSetCommand, { constants, variables }) => {
    variables.handleSetCommandCallback = () => {
      handleSetCommand({ constants, variables });
    };

    constants.htmlElements.commandSearchContainer.addEventListener(
      "mouseenter",
      variables.handleSetCommandCallback
    );
  };

  addCommandHandler(handleSetCommand, {
    constants,
    variables,
  });

  const handleMouseLeaveCommand = ({ constants, variables }) => {
    const { commandSearchContainer } = constants.htmlElements;
    commandSearchContainer.blur();
    commandSearchContainer.removeEventListener(
      "keypress",
      variables.handleGetCommandCallback
    );
  };

  const addMouseLeaveCommandHandler = (
    handleMouseLeaveCommand,
    { constants, variables }
  ) => {
    variables.handleMouseLeaveCommandCallback = () => {
      handleMouseLeaveCommand({ constants, variables });
    };

    constants.htmlElements.commandSearchContainer.addEventListener(
      "mouseleave",
      variables.handleMouseLeaveCommandCallback
    );
  };

  addMouseLeaveCommandHandler(handleMouseLeaveCommand, {
    constants,
    variables,
  });

  const handleSetExtendedCommand = ({ constants, variables }) => {
    const handleGetExtendedCommand = (
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

    const addGetExtendedCommandHandler = (
      handleGetExtendedCommand,
      { constants, variables }
    ) => {
      variables.handleGetExtendedCommandCallback = (event) => {
        handleGetExtendedCommand(event, { constants, variables });
      };

      extendedCommandSearchContainer.addEventListener(
        "keypress",
        variables.handleGetExtendedCommandCallback
      );
    };

    const { extendedCommandSearchContainer } = constants.htmlElements;
    extendedCommandSearchContainer.focus();
    addGetExtendedCommandHandler(handleGetExtendedCommand, {
      constants,
      variables,
    });
  };

  const addSetExtendedCommandHandler = (
    handleSetExtendedCommand,
    { constants, variables }
  ) => {
    variables.handleSetExtendedCommandCallback = () => {
      handleSetExtendedCommand({ constants, variables });
    };

    constants.htmlElements.extendedCommandSearchContainer.addEventListener(
      "mouseenter",
      variables.handleSetExtendedCommandCallback
    );
  };

  addSetExtendedCommandHandler(handleSetExtendedCommand, {
    constants,
    variables,
  });

  const handleMouseLeaveExtendedCommand = ({ constants, variables }) => {
    const { extendedCommandSearchContainer } = constants.htmlElements;
    extendedCommandSearchContainer.blur();
    extendedCommandSearchContainer.removeEventListener(
      "keypress",
      variables.handleGetExtendedCommandCallback
    );
  };

  const addMouseLeaveExtendedCommandHandler = (
    handleMouseLeaveExtendedCommand,
    { constants, variables }
  ) => {
    variables.handleMouseLeaveExtendedCommandCallback = () => {
      handleMouseLeaveExtendedCommand({ constants, variables });
    };

    constants.htmlElements.extendedCommandSearchContainer.addEventListener(
      "mouseleave",
      variables.handleMouseLeaveExtendedCommandCallback
    );
  };

  addMouseLeaveExtendedCommandHandler(handleMouseLeaveExtendedCommand, {
    constants,
    variables,
  });
};

const addSearchFxCmdHandler = (handleSearchFxCmd) => {
  document.addEventListener("DOMContentLoaded", handleSearchFxCmd, false);
};

addSearchFxCmdHandler(handleSearchFxCmd);
