const handleSearchFxCmd = () => {
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
      inputGroupFile01: document.querySelector("#input-group-file01"),
      commandSelect: document.querySelector("#command-select"),
      extendedCommandSelect: document.querySelector("#extended-command-select"),
      commandSearchContainer: document.querySelector("#command-search-container"),
      extendedCommandSearchContainer: document.querySelector(
        "#extended-command-search-container"
      ),
      tableBody: document.querySelector("#table-body"),
      groupChange: document.querySelectorAll(".group-change"),
    },
    // Key codes 0...f for command hex numbers 0...f
    shortkeyHTMLCodes: [
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102,
    ],
    // Index for command and extended command hex numbers 0...f
    shortkeyIndexes: [
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
    searchCommandNumber: 0,
    searchExtendedCommandNumber: 0,
    handleSearchCommandCallback: null,
    handleWaitFileLoadedCallback: null,
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

    const convertInputElementValues = ({ constants, variables }) => {
      const { commandSelect, extendedCommandSelect } = constants.htmlElements;
      variables.searchCommandNumber = parseInt(commandSelect.value);
      variables.searchExtendedCommandNumber = parseInt(
        extendedCommandSelect.value
      );
    };

    const scanCommandsInFile = ({ constants, variables }) => {
      const searchForCommandByNumber = ({ constants, variables }) => {
        const createSongDataTable = (
          {
            songPositionIndexCounter,
            patternRowIndexCounter,
            noteDataIndexCounter,
            patternNumber,
          },
          constants
        ) => {
          const createListEntry = (tr, entry) => {
            const td = document.createElement("td");
            td.innerHTML = entry.toString();
            tr.append(td);
          };

          const { tableBody } = constants.htmlElements;
          const tr = document.createElement("tr");
          tableBody.append(tr);
          createListEntry(tr, songPositionIndexCounter);
          createListEntry(tr, patternNumber);
          createListEntry(tr, patternRowIndexCounter);
          createListEntry(tr, noteDataIndexCounter);
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
        const {
          fileContent,
          searchCommandNumber,
          searchExtendedCommandNumber,
        } = variables;
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
              if (
                commandNumber === searchCommandNumber &&
                commandNumber !== 14
              ) {
                if (commandNumber === 0 && searchCommandNumber === 0) {
                  const commandNumberOffset =
                    patternStartOffset +
                    patternOffset +
                    patternRowOffset +
                    noteDataOffset +
                    commandLowbyteOffset;
                  commandLowbyte =
                    fileContent[commandNumberOffset].charCodeAt(0);
                  if (commandLowbyte > 0) {
                    createSongDataTable(
                      {
                        songPositionIndexCounter,
                        patternRowIndexCounter,
                        noteDataIndexCounter,
                        patternNumber,
                      },
                      constants
                    );
                  }
                } else {
                  createSongDataTable(
                    {
                      songPositionIndexCounter,
                      patternRowIndexCounter,
                      noteDataIndexCounter,
                      patternNumber,
                    },
                    constants
                  );
                }
              }
              if (commandNumber === 14) {
                const extendedcommandNumberOffset =
                  patternStartOffset +
                  patternOffset +
                  patternRowOffset +
                  noteDataOffset +
                  commandLowbyteOffset;
                extendedCommandNumber =
                  fileContent[extendedcommandNumberOffset].charCodeAt(0) >> 4;
                if (extendedCommandNumber === searchExtendedCommandNumber) {
                  createSongDataTable(
                    {
                      songPositionIndexCounter,
                      patternRowIndexCounter,
                      noteDataIndexCounter,
                      patternNumber,
                    },
                    constants
                  );
                }
              }
            }
          }
        }
      };

      const { searchCommandNumber } = variables;
      if (searchCommandNumber !== -1) {
        clearSongDataTable(constants);
        searchForCommandByNumber({ constants, variables });
      }
    };

    const { isFileLoaded } = variables;
    if (isFileLoaded) {
      variables.highestPatternNumber = highestSongPattern({
        constants,
        variables,
      });
      convertInputElementValues({ constants, variables });
      scanCommandsInFile({ constants, variables });
    }
  };

  const handleLoadFile = ({ constants, variables }) => {
    const handleWaitFileLoaded = (reader, { constants, variables }) => {
      const resetValues = ({ constants, variables }) => {
        const { commandSelect, extendedCommandSelect } = constants.htmlElements;
        commandSelect.value = "-1";
        extendedCommandSelect.value = "-1";
        variables.isFileLoaded = true;
      };

      resetValues({ constants, variables });
      clearSongDataTable(constants);
      reader.removeEventListener(
        "load",
        variables.handleWaitFileLoadedCallback
      );
    };

    const addWaitFileLoadedHandler = (
      reader,
      handleWaitFileLoaded,
      { constants, variables }
    ) => {
      variables.handleWaitFileLoadedCallback = () => {
        handleWaitFileLoaded(reader, { constants, variables });
      };

      reader.addEventListener("load", variables.handleWaitFileLoadedCallback);
    };

    variables.isFileLoaded = false;
    const { inputGroupFile01 } = constants.htmlElements;
    const input = inputGroupFile01.files;
    const file = input[0];
    const reader = new FileReader();
    reader.onload = ({ target }) => (variables.fileContent = target.result);
    reader.readAsBinaryString(file);
    addWaitFileLoadedHandler(reader, handleWaitFileLoaded, {
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

    const { commandSelect } = constants.htmlElements;
    commandSelect.addEventListener(
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

    const { extendedCommandSelect } = constants.htmlElements;
    extendedCommandSelect.addEventListener(
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
      const { shortkeyHTMLCodes, shortkeyIndexes, htmlElements } = constants;
      const { commandSelect, extendedCommandSelect } = htmlElements;
      const pressedKeyHTMLCode = which || keyCode;
      for (let i = 0; i < shortkeyHTMLCodes.length; i++) {
        if (shortkeyHTMLCodes[i] === pressedKeyHTMLCode) {
          (commandSelect.value = shortkeyIndexes[i]) === "14"
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

      const { commandSearchContainer } = constants.htmlElements;
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

    const { commandSearchContainer } = constants.htmlElements;
    commandSearchContainer.addEventListener(
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

    const { commandSearchContainer } = constants.htmlElements;
    commandSearchContainer.addEventListener(
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
      const { shortkeyHTMLCodes, shortkeyIndexes, htmlElements } = constants;
      const { commandSelect, extendedCommandSelect } = htmlElements;
      const pressedKeyHTMLCode = which || keyCode;
      for (let i = 0; i < shortkeyHTMLCodes.length; i++) {
        if (shortkeyHTMLCodes[i] === pressedKeyHTMLCode) {
          extendedCommandSelect.value = shortkeyIndexes[i];
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

      const { extendedCommandSearchContainer } = constants.htmlElements;
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

    const { extendedCommandSearchContainer } = constants.htmlElements;
    extendedCommandSearchContainer.addEventListener(
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

    const { extendedCommandSearchContainer } = constants.htmlElements;
    extendedCommandSearchContainer.addEventListener(
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
