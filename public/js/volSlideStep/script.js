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
      ticsInput: document.querySelector("#tics-input"),
      instrumentVolumeInput: document.querySelector("#instrument-volume-input"),
      unitsInput: document.querySelector("#units-input"),
      fineslideContainer: document.querySelector("#fineslide-container"),
      fineslideCheckbox: document.querySelector("#fineslide-checkbox"),
      commandsResult: document.querySelector("#commands-result"),
      unitsResult: document.querySelector("#units-result"),
      resetButton: document.querySelector("#reset-button"),
      groupChange: document.querySelectorAll(".group-change"),
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
    const {
      htmlElements: { fineslideContainer, fineslideCheckbox },
    } = constants;
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
      htmlElements: { commandsResult, unitsResult },
    } = constants;
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

    const {
      htmlElements: { fineslideCheckbox },
    } = constants;
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
    const {
      htmlElements: { ticsInput, instrumentVolumeInput, unitsInput },
    } = constants;
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
    const setDefaultTextColor = ({
      htmlElements: { commandsResult, unitsResult },
    }) => {
      if (
        commandsResult.classList.contains("text-danger") ||
        unitsResult.classList.contains("text-danger")
      ) {
        commandsResult.classList.remove("text-danger");
        commandsResult.classList.add("is-dark-grey");
        unitsResult.classList.remove("text-danger");
        unitsResult.classList.add("is-dark-grey");
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
      htmlElements: { commandsResult, unitsResult },
    } = constants;
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
        commandsResult.classList.contains("is-dark-grey") ||
        unitsResult.classList.contains("is-dark-grey")
      ) {
        commandsResult.classList.remove("is-dark-grey");
        commandsResult.classList.add("text-danger");
        unitsResult.classList.remove("is-dark-grey");
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

    const {
      htmlElements: { groupChange },
    } = constants;
    groupChange.forEach((element) => {
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
        htmlElements: {
          ticsInput,
          instrumentVolumeInput,
          unitsInput,
          commandsResult,
          unitsResult,
          fineslideCheckbox,
          fineslideContainer,
        },
      } = constants;
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

    const {
      htmlElements: { resetButton },
    } = constants;
    resetButton.addEventListener("click", variables.handleResetButtonCallback);
  };

  addResetButtonHandler(handleResetButton, { constants, variables });
  handleCalculateVolume({ constants, variables });
};

const addVolSlideStepHandler = (handleVolSlideStep) => {
  document.addEventListener("DOMContentLoaded", handleVolSlideStep, false);
};

addVolSlideStepHandler(handleVolSlideStep);
