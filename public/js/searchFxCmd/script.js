// Handler for SearchFxCmd
const handleSearchFxCmd = () => {
  // ---------- Global ----------
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
    handleWaitForLoadCallback: null,
    handleLoadModuleCallback: null,
    handleCheckCommandCallback: null,
    handleCheckExtendedCommandCallback: null,
    handleGetKeyCommandCallback: null,
    handleSetManualCommandCallback: null,
    handleMouseLeaveCommandCallback: null,
    handleGetKeyExtendedCommandCallback: null,
    handleSetManualExtendedCommandCallback: null,
    handleMouseLeaveExtendedCommandCallback: null,
  };

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

  // Get select values and convert them to integers
  const getInputElementValues = ({ htmlElements }, variables) => {
    const { commandSelect, extendedCommandSelect } = htmlElements;
    variables.searchCommandNumber = parseInt(commandSelect.value);
    variables.searchExtendedCommandNumber = parseInt(
      extendedCommandSelect.value
    );
  };

  // Create list entry
  const createListEntry = (tr, entryText) => {
    const td = document.createElement("td");
    td.innerHTML = entryText.toString();
    tr.append(td);
  };

  // Fill the table with the values: Position, Pattern, Patternrow and Channel number
  const outputDataToTable = (
    { noteDataLength, patternRowLength, htmlElements },
    variables,
    { i, j, k }
  ) => {
    const tr = document.createElement("tr");
    htmlElements.tableBody.append(tr);
    createListEntry(tr, i);
    createListEntry(tr, variables.patternNumber);
    createListEntry(tr, j / patternRowLength);
    createListEntry(tr, k / noteDataLength);
  };

  // Search command or extended command by number
  const searchForCommand = (constants, variables) => {
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
        for (let k = 0; k < maxChannels * noteDataLength; k += noteDataLength) {
          // 4th steps per channel
          const commandNumberIndex =
            patternStartOffset + patternOffset + j + k + commandOffset;
          variables.commandNumber =
            fileContent[commandNumberIndex].charCodeAt(0) & commandNumberMask; // Mask out upper nibble
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
              (variables.commandLowbyte =
                variables.fileContent[commandNumberIndex].charCodeAt(0)) > 0 &&
                outputDataToTable(constants, variables, { i, j, k });
            } else {
              outputDataToTable(constants, variables, { i, j, k });
            }
          }
          if (variables.commandNumber === 14) {
            const extendedCommandNumberIndex =
              patternStartOffset + patternOffset + j + k + commandLowbyteOffset;
            (variables.extendedCommandNumber =
              variables.fileContent[extendedCommandNumberIndex].charCodeAt(0) >>
              4) === variables.searchExtendedCommandNumber &&
              outputDataToTable(constants, variables, { i, j, k });
          }
        }
      }
    }
  };

  // Scan for commands in Mod file
  const scanModFile = (constants, variables) => {
    const { htmlElements } = constants;
    const { tableBody } = htmlElements;
    if (variables.searchCommandNumber !== -1) {
      tableBody.innerHTML = ""; // Remove <tr>/<td> tags from table
      searchForCommand(constants, variables);
    }
  };

  // Handler for search command in patterns if module was a loaded
  const handleSearchCommand = (constants, variables) => {
    if (variables.isFileLoaded) {
      getHighestPattern(constants, variables);
      getInputElementValues(constants, variables);
      scanModFile(constants, variables);
    }
  };
  // Add handler for search command in patterns if module was a loaded
  variables.handleSearchCommandCallback = () =>
    handleSearchCommand(constants, variables);
  constants.htmlElements.groupChange.forEach((element) =>
    element.addEventListener("change", variables.handleSearchCommandCallback)
  );

  // Handler for load module if "Choose file" was clicked
  const handleLoadModule = (constants, variables) => {
    variables.isFileLoaded = false;
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

    // Reset all values
    const resetValues = ({ htmlElements }) => {
      const { commandSelect, extendedCommandSelect, tableBody } = htmlElements;
      commandSelect.value = "-1";
      extendedCommandSelect.value = "-1";
      tableBody.innerHTML = ""; // Remove tr/td tags from table
    };

    // Handler to wait until module is loaded
    const handleWaitForLoad = (constants, variables) => {
      variables.isFileLoaded = true;
      resetValues(constants);
      reader.removeEventListener("load", variables.handleWaitForLoadCallback);
    };
    // Add handler for wait until module is loaded
    variables.handleWaitForLoadCallback = () =>
      handleWaitForLoad(constants, variables);
    reader.addEventListener("load", variables.handleWaitForLoadCallback);
  };
  // Add handler for load module if "Choose file" button was clicked
  variables.handleLoadModuleCallback = () =>
    handleLoadModule(constants, variables);
  constants.htmlElements.inputGroupFile01.addEventListener(
    "change",
    variables.handleLoadModuleCallback
  );

  // Handler for set extended command number to 0 if command hex number E was selected
  const handleCheckCommand = (constants) => {
    const { commandSelect, extendedCommandSelect } = constants.htmlElements;
    commandSelect.value === "14"
      ? (extendedCommandSelect.value = "0")
      : (extendedCommandSelect.value = "-1");
  };
  // Add handler for set extended command number to 0 if command hex number E was selected
  variables.handleCheckCommandCallback = () => handleCheckCommand(constants);
  constants.htmlElements.commandSelect.addEventListener(
    "change",
    variables.handleCheckCommandCallback
  );

  // Handler for set command number to hex E if extended command number was selected
  const handleCheckExtendedCommand = (constants) => {
    const { commandSelect, extendedCommandSelect } = constants.htmlElements;
    extendedCommandSelect.value === "-1"
      ? (commandSelect.value = "-1")
      : (commandSelect.value = "14");
  };
  // Add handler for set command number to hex E if extended command number was selected
  variables.handleCheckExtendedCommandCallback = () =>
    handleCheckExtendedCommand(constants);
  constants.htmlElements.extendedCommandSelect.addEventListener(
    "change",
    variables.handleCheckExtendedCommandCallback
  );

  // Handler for pressed key to set command number
  const handleGetKeyCommand = ({ which, keyCode }, constants, variables) => {
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
    handleSearchCommand(constants, variables);
  };
  // Handler for manual key mode to set command number
  const handleSetManualCommand = (constants, variables) => {
    const { commandSearchContainer } = constants.htmlElements;
    commandSearchContainer.focus();
    // Add handler to get pressed key to set command number
    variables.handleGetKeyCommandCallback = (event) =>
      handleGetKeyCommand(event, constants, variables);
    commandSearchContainer.addEventListener(
      "keypress",
      variables.handleGetKeyCommandCallback
    );
  };
  // Add handler to for manual key mode to set command number
  variables.handleSetManualCommandCallback = () =>
    handleSetManualCommand(constants, variables);
  constants.htmlElements.commandSearchContainer.addEventListener(
    "mouseenter",
    variables.handleSetManualCommandCallback
  );
  // Handler for mouse leave command number
  const handleMouseLeaveCommand = ({ htmlElements }, variables) => {
    const { commandSearchContainer } = htmlElements;
    commandSearchContainer.blur();
    // Remove handler to get pressed key source note
    commandSearchContainer.removeEventListener(
      "keypress",
      variables.handleGetKeyCommandCallback
    );
  };
  // Add handler for mouse leave to set command number
  variables.handleMouseLeaveCommandCallback = () =>
    handleMouseLeaveCommand(constants, variables);
  constants.htmlElements.commandSearchContainer.addEventListener(
    "mouseleave",
    variables.handleMouseLeaveCommandCallback
  );

  // Handler for pressed key to set extended command number
  const handleGetKeyExtendedCommand = (
    { which, keyCode },
    constants,
    variables
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
    handleSearchCommand(constants, variables);
  };
  // Handler for manual key mode to set extended command number
  const handleSetManualExtendedCommand = (constants, variables) => {
    const { extendedCommandSearchContainer } = constants.htmlElements;
    extendedCommandSearchContainer.focus();
    // Add handler to get pressed key to set extended command number
    variables.handleGetKeyExtendedCommandCallback = (event) =>
      handleGetKeyExtendedCommand(event, constants, variables);
    extendedCommandSearchContainer.addEventListener(
      "keypress",
      variables.handleGetKeyExtendedCommandCallback
    );
  };
  // Add handler to for manual key mode to set extended command number
  variables.handleSetManualExtendedCommandCallback = () =>
    handleSetManualExtendedCommand(constants, variables);
  constants.htmlElements.extendedCommandSearchContainer.addEventListener(
    "mouseenter",
    variables.handleSetManualExtendedCommandCallback
  );
  // Handler for mouse leave extended command number
  const handleMouseLeaveExtendedCommand = ({ htmlElements }, variables) => {
    const { extendedCommandSearchContainer } = htmlElements;
    extendedCommandSearchContainer.blur();
    // Remove handler to get pressed key source note
    extendedCommandSearchContainer.removeEventListener(
      "keypress",
      variables.handleGetKeyExtendedCommandCallback
    );
  };
  // Add handler for mouse leave to set extended command number
  variables.handleMouseLeaveExtendedCommandCallback = () =>
    handleMouseLeaveExtendedCommand(constants, variables);
  constants.htmlElements.extendedCommandSearchContainer.addEventListener(
    "mouseleave",
    variables.handleMouseLeaveExtendedCommandCallback
  );
};

// Add handler for SearchFxCmd
document.addEventListener("DOMContentLoaded", handleSearchFxCmd, false);
