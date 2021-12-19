const handleVolSlideStep = () => {
  const constants = {
    definedTics: 6,
    definedInstrumentVolume: 64,
    definedUnits: 1,
    maxVolumeSlideCommands: 64,
    maxFinevolumeSlideUnits: 15, // hex F
    definedVolumeslideTooltipText: "Number of commands ranges from 1 to 64",
    definedFinevolumeSlideTooltipText: "Number of units ranges from hex 1 to F",
    volumeSlideTooltipErrorText: "Number of commands is greater than 64",
    finevolumeSlideTooltipErrorText: "Number of units is greater than hex F",
    errorText: "**",
    // HTML element objects
    htmlElements: {
      ticsInput: document.querySelector("#ticsInput"),
      instrumentVolumeInput: document.querySelector("#instrumentVolumeInput"),
      unitsInput: document.querySelector("#unitsInput"),
      finevolumeSlideContainer: document.querySelector(
        "#finevolumeSlideContainer"
      ),
      finevolumeSlideCheckbox: document.querySelector(
        "#finevolumeSlideCheckbox"
      ),
      commandsResult: document.querySelector("#commandsResult"),
      unitsResult: document.querySelector("#unitsResult"),
      resetButton: document.querySelector("#resetButton"),
      groupChange: document.querySelectorAll(".groupChange"),
    },
  };

  const { definedTics, definedInstrumentVolume, definedUnits } = constants;
  const variables = {
    volumeSlideCommands: 0,
    finevolumeSlideCommands: 0,
    finevolumeSlideUnits: 0,
    commandsToggle: 0,
    tics: definedTics,
    instrumentVolume: definedInstrumentVolume,
    units: definedUnits,
    handleFinevolumeCheckboxStateCallback: null,
    handleCalculateVolumeCallback: null,
    handleResetButtonCallback: null,
  };

  const setFinevolumeSlideVisibility = ({ constants, variables }) => {
    const { finevolumeSlideContainer, finevolumeSlideCheckbox } =
      constants.htmlElements;
    const { finevolumeSlideCommands, volumeSlideCommands } = variables;
    if (finevolumeSlideCheckbox.checked) {
      variables.commandsToggle = finevolumeSlideCommands;
      finevolumeSlideContainer.classList.remove("d-none");
    } else {
      variables.commandsToggle = volumeSlideCommands;
      finevolumeSlideContainer.classList.add("d-none");
    }
  };

  const handleFinevolumeCheckboxState = ({ constants, variables }) => {
    const {
      maxVolumeSlideCommands,
      maxFinevolumeSlideUnits,
      definedVolumeslideTooltipText,
      definedFinevolumeSlideTooltipText,
      volumeSlideTooltipErrorText,
      finevolumeSlideTooltipErrorText,
      errorText,
      htmlElements,
    } = constants;
    const { commandsResult, unitsResult } = htmlElements;
    setFinevolumeSlideVisibility({ constants, variables });
    [commandsResult.title, unitsResult.title] = [
      definedVolumeslideTooltipText,
      definedFinevolumeSlideTooltipText,
    ];
    if (
      variables.commandsToggle > maxVolumeSlideCommands &&
      variables.finevolumeSlideUnits > maxFinevolumeSlideUnits
    ) {
      [variables.commandsToggle, variables.finevolumeSlideUnits] = [
        errorText,
        errorText,
      ];
      [commandsResult.title, unitsResult.title] = [
        volumeSlideTooltipErrorText,
        finevolumeSlideTooltipErrorText,
      ];
    }
    commandsResult.innerHTML = variables.commandsToggle.toString();
    unitsResult.innerHTML = variables.finevolumeSlideUnits
      .toString(16)
      .toUpperCase();
  };

  const addCheckboxStateHandler = (
    handleFinevolumeCheckboxState,
    { constants, variables }
  ) => {
    variables.handleFinevolumeCheckboxStateCallback = () => {
      handleFinevolumeCheckboxState({ constants, variables });
    };

    constants.htmlElements.finevolumeSlideCheckbox.addEventListener(
      "change",
      variables.handleFinevolumeCheckboxStateCallback
    );
  };

  addCheckboxStateHandler(handleFinevolumeCheckboxState, {
    constants,
    variables,
  });

  const convertInputElementsValues = ({ constants, variables }) => {
    const { ticsInput, instrumentVolumeInput, unitsInput } =
      constants.htmlElements;
    variables.tics = parseInt(ticsInput.value);
    variables.tics--; // Without first tick
    variables.instrumentVolume = parseInt(instrumentVolumeInput.value);
    variables.units = parseInt(unitsInput.value);
  };

  const calculateVolumeUnits = (variables) => {
    const { tics, instrumentVolume, units } = variables;
    variables.volumeSlideCommands = Math.ceil(instrumentVolume / tics);
    variables.volumeSlideCommands = Math.ceil(
      variables.volumeSlideCommands / units
    );
  };

  const calculateFinevolumeUnits = (variables) => {
    const { tics, instrumentVolume, units } = variables;
    variables.finevolumeSlideCommands = Math.floor(
      instrumentVolume / tics / units
    );
    variables.finevolumeSlideUnits = instrumentVolume % tics;
  };

  const printAmountOfCommandsAndUnits = ({ constants, variables }) => {
    const setDefaultTextColor = ({ htmlElements }) => {
      const { commandsResult, unitsResult } = htmlElements;
      if (
        commandsResult.classList.contains("text-danger") ||
        unitsResult.classList.contains("text-danger")
      ) {
        commandsResult.classList.remove("text-danger");
        commandsResult.classList.add("textColored");
        unitsResult.classList.remove("text-danger");
        unitsResult.classList.add("textColored");
      }
    };

    const {
      maxVolumeSlideCommands,
      maxFinevolumeSlideUnits,
      definedVolumeslideTooltipText,
      definedFinevolumeSlideTooltipText,
      volumeSlideTooltipErrorText,
      finevolumeSlideTooltipErrorText,
      errorText,
      htmlElements,
    } = constants;
    const { commandsResult, unitsResult } = htmlElements;
    [commandsResult.title, unitsResult.title] = [
      definedVolumeslideTooltipText,
      definedFinevolumeSlideTooltipText,
    ];
    if (
      variables.volumeSlideCommands <= maxVolumeSlideCommands &&
      variables.finevolumeSlideUnits <= maxFinevolumeSlideUnits
    ) {
      setDefaultTextColor(constants);
    } else {
      [variables.commandsToggle, variables.finevolumeSlideUnits] = [
        errorText,
        errorText,
      ];
      [commandsResult.title, unitsResult.title] = [
        volumeSlideTooltipErrorText,
        finevolumeSlideTooltipErrorText,
      ];
      if (
        commandsResult.classList.contains("textColored") ||
        unitsResult.classList.contains("textColored")
      ) {
        commandsResult.classList.remove("textColored");
        commandsResult.classList.add("text-danger");
        unitsResult.classList.remove("textColored");
        unitsResult.classList.add("text-danger");
      }
    }
    commandsResult.innerHTML = variables.commandsToggle.toString();
    unitsResult.innerHTML = variables.finevolumeSlideUnits
      .toString(16)
      .toUpperCase();
  };

  const handleCalculateVolume = ({ constants, variables }) => {
    convertInputElementsValues({ constants, variables });
    calculateVolumeUnits(variables);
    calculateFinevolumeUnits(variables);
    setFinevolumeSlideVisibility({ constants, variables });
    printAmountOfCommandsAndUnits({ constants, variables });
  };

  const addCalculateVolumeHandler = (
    handleCalculateVolume,
    { constants, variables }
  ) => {
    variables.handleCalculateVolumeCallback = () => {
      handleCalculateVolume({ constants, variables });
    };

    constants.htmlElements.groupChange.forEach((element) => {
      element.addEventListener(
        "change",
        variables.handleCalculateVolumeCallback
      );
    });
  };

  addCalculateVolumeHandler(handleCalculateVolume, { constants, variables });

  const handleResetButton = ({ constants, variables }) => {
    const clearVariables = ({ constants, variables }) => {
      const {
        definedTics,
        definedInstrumentVolume,
        definedUnits,
        definedVolumeslideTooltipText,
        definedFinevolumeSlideTooltipText,
        htmlElements,
      } = constants;
      const { ticsInput, instrumentVolumeInput, unitsInput } = htmlElements;
      variables.volumeslideCommands = 0;
      variables.finevolumeSlideCommands = 0;
      variables.commandsToggle = 0;
      variables.finevolumeSlideUnits = 0;
      ticsInput.value = definedTics;
      instrumentVolumeInput.value = definedInstrumentVolume;
      unitsInput.value = definedUnits;
      commandsResult.innerHTML = "0";
      commandsResult.title = definedVolumeslideTooltipText;
      unitsResult.innerHTML = "0";
      unitsResult.title = definedFinevolumeSlideTooltipText;
      finevolumeSlideCheckbox.checked = false;
      finevolumeSlideContainer.classList.add("d-none");
      handleCalculateVolume({ constants, variables });
    };

    clearVariables({ constants, variables });
  };

  const addResetButtonHandler = (
    handleResetButton,
    { constants, variables }
  ) => {
    variables.handleResetButtonCallback = () => {
      handleResetButton({ constants, variables });
    };

    resetButton.addEventListener("click", variables.handleResetButtonCallback);
  };

  addResetButtonHandler(handleResetButton, { constants, variables });
  handleCalculateVolume({ constants, variables });
};

const addVolSlideStepHandler = (handleVolSlideStep) => {
  document.addEventListener("DOMContentLoaded", handleVolSlideStep, false);
};

addVolSlideStepHandler(handleVolSlideStep);
