const handleVolSlideStep = () => {
  const constants = {
    definedTics: 6,
    definedInstrumentVolume: 64,
    definedUnits: 1,
    maxVolumeSlideCommands: 64,
    maxfineslideUnits: 15, // hex F
    definedVolumeSlideTooltipText: "Number of commands ranges from 1 to 64",
    definedFineslideTooltipText: "Number of units ranges from hex 1 to F",
    volumeSlideTooltipErrorText: "Number of commands is greater than 64",
    fineslideTooltipErrorText: "Number of units is greater than hex F",
    errorText: "**",
    // HTML element objects
    htmlElements: {
      ticsInput: document.querySelector("#ticsInput"),
      instrumentVolumeInput: document.querySelector("#instrumentVolumeInput"),
      unitsInput: document.querySelector("#unitsInput"),
      fineslideContainer: document.querySelector("#fineslideContainer"),
      fineslideCheckbox: document.querySelector("#fineslideCheckbox"),
      commandsResult: document.querySelector("#commandsResult"),
      unitsResult: document.querySelector("#unitsResult"),
      resetButton: document.querySelector("#resetButton"),
      groupChange: document.querySelectorAll(".groupChange"),
    },
  };

  const { definedTics, definedInstrumentVolume, definedUnits } = constants;
  const variables = {
    volumeSlideCommands: 0,
    fineslideCommands: 0,
    fineslideUnits: 0,
    commandsToggle: 0,
    tics: definedTics,
    instrumentVolume: definedInstrumentVolume,
    units: definedUnits,
    handlefineslideCheckboxStateCallback: null,
    handleCalculateVolumeCallback: null,
    handleResetButtonCallback: null,
  };

  const setFineslideVisibility = ({ constants, variables }) => {
    const { fineslideContainer, fineslideCheckbox } = constants.htmlElements;
    const { fineslideCommands, volumeSlideCommands } = variables;
    if (fineslideCheckbox.checked) {
      variables.commandsToggle = fineslideCommands;
      fineslideContainer.classList.remove("d-none");
    } else {
      variables.commandsToggle = volumeSlideCommands;
      fineslideContainer.classList.add("d-none");
    }
  };

  const handlefineslideCheckboxState = ({ constants, variables }) => {
    const {
      maxVolumeSlideCommands,
      maxfineslideUnits,
      definedVolumeSlideTooltipText,
      definedFineslideTooltipText,
      volumeSlideTooltipErrorText,
      fineslideTooltipErrorText,
      errorText,
      htmlElements,
    } = constants;
    const { commandsResult, unitsResult } = htmlElements;
    setFineslideVisibility({ constants, variables });
    [commandsResult.title, unitsResult.title] = [
      definedVolumeSlideTooltipText,
      definedFineslideTooltipText,
    ];
    if (
      variables.commandsToggle > maxVolumeSlideCommands &&
      variables.fineslideUnits > maxfineslideUnits
    ) {
      [variables.commandsToggle, variables.fineslideUnits] = [
        errorText,
        errorText,
      ];
      [commandsResult.title, unitsResult.title] = [
        volumeSlideTooltipErrorText,
        fineslideTooltipErrorText,
      ];
    }
    commandsResult.innerHTML = variables.commandsToggle.toString();
    unitsResult.innerHTML = variables.fineslideUnits.toString(16).toUpperCase();
  };

  const addCheckboxStateHandler = (
    handlefineslideCheckboxState,
    { constants, variables }
  ) => {
    variables.handlefineslideCheckboxStateCallback = () => {
      handlefineslideCheckboxState({ constants, variables });
    };

    const { fineslideCheckbox } = constants.htmlElements;
    fineslideCheckbox.addEventListener(
      "change",
      variables.handlefineslideCheckboxStateCallback
    );
  };

  addCheckboxStateHandler(handlefineslideCheckboxState, {
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

  const calculatefineslideUnits = (variables) => {
    const { tics, instrumentVolume, units } = variables;
    variables.fineslideCommands = Math.floor(instrumentVolume / tics / units);
    variables.fineslideUnits = instrumentVolume % tics;
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
      maxfineslideUnits,
      definedVolumeSlideTooltipText,
      definedFineslideTooltipText,
      volumeSlideTooltipErrorText,
      fineslideTooltipErrorText,
      errorText,
      htmlElements,
    } = constants;
    const { commandsResult, unitsResult } = htmlElements;
    [commandsResult.title, unitsResult.title] = [
      definedVolumeSlideTooltipText,
      definedFineslideTooltipText,
    ];
    if (
      variables.volumeSlideCommands <= maxVolumeSlideCommands &&
      variables.fineslideUnits <= maxfineslideUnits
    ) {
      setDefaultTextColor(constants);
    } else {
      [variables.commandsToggle, variables.fineslideUnits] = [
        errorText,
        errorText,
      ];
      [commandsResult.title, unitsResult.title] = [
        volumeSlideTooltipErrorText,
        fineslideTooltipErrorText,
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
    unitsResult.innerHTML = variables.fineslideUnits.toString(16).toUpperCase();
  };

  const handleCalculateVolume = ({ constants, variables }) => {
    convertInputElementsValues({ constants, variables });
    calculateVolumeUnits(variables);
    calculatefineslideUnits(variables);
    setFineslideVisibility({ constants, variables });
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
        definedVolumeSlideTooltipText,
        definedFineslideTooltipText,
        htmlElements,
      } = constants;
      const { ticsInput, instrumentVolumeInput, unitsInput } = htmlElements;
      variables.volumeslideCommands = 0;
      variables.fineslideCommands = 0;
      variables.commandsToggle = 0;
      variables.fineslideUnits = 0;
      ticsInput.value = definedTics;
      instrumentVolumeInput.value = definedInstrumentVolume;
      unitsInput.value = definedUnits;
      commandsResult.innerHTML = "0";
      commandsResult.title = definedVolumeSlideTooltipText;
      unitsResult.innerHTML = "0";
      unitsResult.title = definedFineslideTooltipText;
      fineslideCheckbox.checked = false;
      fineslideContainer.classList.add("d-none");
    };

    clearVariables({ constants, variables });
    handleCalculateVolume({ constants, variables });
  };

  const addResetButtonHandler = (
    handleResetButton,
    { constants, variables }
  ) => {
    variables.handleResetButtonCallback = () => {
      handleResetButton({ constants, variables });
    };

    const { resetButton } = constants.htmlElements;
    resetButton.addEventListener("click", variables.handleResetButtonCallback);
  };

  addResetButtonHandler(handleResetButton, { constants, variables });
  handleCalculateVolume({ constants, variables });
};

const addVolSlideStepHandler = (handleVolSlideStep) => {
  document.addEventListener("DOMContentLoaded", handleVolSlideStep, false);
};

addVolSlideStepHandler(handleVolSlideStep);
