// Handler for VolSlideStep
const handleVolSlideStep = () => {
  // ---------- Global ---------
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
    outputErrorText: "**",
    // HTML element objects
    htmlElements: {
      ticsButton: document.querySelector("#ticsButton"),
      instrumentVolumeButton: document.querySelector("#instrumentVolumeButton"),
      unitsButton: document.querySelector("#unitsButton"),
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
  };

  // Set default text color if it as red
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

  // Check state of checkbox and show/hide fine volume slide container
  const checkFinevolume = ({ htmlElements }, variables) => {
    const { finevolumeSlideContainer, finevolumeSlideCheckbox } = htmlElements;
    const { finevolumeSlideCommands, volumeSlideCommands } = variables;
    if (finevolumeSlideCheckbox.checked) {
      variables.commandsToggle = finevolumeSlideCommands;
      finevolumeSlideContainer.classList.remove("d-none");
    } else {
      variables.commandsToggle = volumeSlideCommands;
      finevolumeSlideContainer.classList.add("d-none");
    }
  };

  // Check checkbox state and show/hide fine volume slide
  const handleCheckboxState = (constants, variables) => {
    const {
      maxVolumeSlideCommands,
      maxFinevolumeSlideUnits,
      definedVolumeslideTooltipText,
      definedFinevolumeSlideTooltipText,
      volumeSlideTooltipErrorText,
      finevolumeSlideTooltipErrorText,
      outputErrorText,
      htmlElements,
    } = constants;
    const { commandsResult, unitsResult } = htmlElements;
    checkFinevolume(constants, variables);
    [commandsResult.title, unitsResult.title] = [
      definedVolumeslideTooltipText,
      definedFinevolumeSlideTooltipText,
    ];
    if (
      variables.commandsToggle > maxVolumeSlideCommands &&
      variables.finevolumeSlideUnits > maxFinevolumeSlideUnits
    ) {
      [variables.commandsToggle, variables.finevolumeSlideUnits] = [
        outputErrorText,
        outputErrorText,
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
  // Add handler for Check checkbox state and show/hide fine volume slide
  constants.htmlElements.finevolumeSlideCheckbox.addEventListener(
    "change",
    () => handleCheckboxState(constants, variables)
  );

  // Handler for values variables
  const handleCalculateValues = (constants, variables, setDefaultTextColor) => {
    // Get input element values and convert them to integers
    const getInputElementsValues = ({ htmlElements }, variables) => {
      const { ticsButton, instrumentVolumeButton, unitsButton } = htmlElements;
      variables.tics = parseInt(ticsButton.value);
      variables.tics--; // Without first tick
      variables.instrumentVolume = parseInt(instrumentVolumeButton.value);
      variables.units = parseInt(unitsButton.value);
    };

    // Calculate coomands per row without fine volume slide
    const calculateUnits = (variables) => {
      const { tics, instrumentVolume, units } = variables;
      variables.volumeSlideCommands = Math.ceil(instrumentVolume / tics);
      variables.volumeSlideCommands = Math.ceil(
        variables.volumeSlideCommands / units
      );
    };

    // Calculate comands per row and units per command considering fine volume slide
    const calculateUnitsFinevolume = (variables) => {
      const { tics, instrumentVolume, units } = variables;
      variables.finevolumeSlideCommands = Math.floor(
        instrumentVolume / tics / units
      );
      variables.finevolumeSlideUnits = instrumentVolume % tics;
    };

    // Check maxinun of volume slide commands number or fine volume slide units number and output units
    const outputUnits = (constants, variables, setDefaultTextColor) => {
      const {
        maxVolumeSlideCommands,
        maxFinevolumeSlideUnits,
        definedVolumeslideTooltipText,
        definedFinevolumeSlideTooltipText,
        volumeSlideTooltipErrorText,
        finevolumeSlideTooltipErrorText,
        outputErrorText,
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
          outputErrorText,
          outputErrorText,
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
      // Output commands per row and fine slide units per command
      commandsResult.innerHTML = variables.commandsToggle.toString();
      unitsResult.innerHTML = variables.finevolumeSlideUnits
        .toString(16)
        .toUpperCase();
    };

    getInputElementsValues(constants, variables);
    calculateUnits(variables);
    calculateUnitsFinevolume(variables);
    checkFinevolume(constants, variables);
    outputUnits(constants, variables, setDefaultTextColor);
  };
  // Add handler for values variables
  constants.htmlElements.groupChange.forEach((element) =>
    element.addEventListener("change", () =>
      handleCalculateValues(constants, variables, setDefaultTextColor)
    )
  );

  // Reset all values
  const handleResetButton = (
    constants,
    variables,
    { setDefaultTextColor, handleCalculateValues }
  ) => {
    const {
      definedTics,
      definedInstrumentVolume,
      definedUnits,
      definedVolumeslideTooltipText,
      definedFinevolumeSlideTooltipText,
      htmlElements,
    } = constants;
    const { ticsButton, instrumentVolumeButton, unitsButton } = htmlElements;
    variables.volumeslideCommands = 0;
    variables.finevolumeSlideCommands = 0;
    variables.commandsToggle = 0;
    variables.finevolumeSlideUnits = 0;
    ticsButton.value = definedTics;
    instrumentVolumeButton.value = definedInstrumentVolume;
    unitsButton.value = definedUnits;
    commandsResult.innerHTML = "0";
    commandsResult.title = definedVolumeslideTooltipText;
    unitsResult.innerHTML = "0";
    unitsResult.title = definedFinevolumeSlideTooltipText;
    finevolumeSlideCheckbox.checked = false;
    finevolumeSlideContainer.classList.add("d-none");
    handleCalculateValues(constants, variables, setDefaultTextColor);
  };
  // Add handler for click on reset button
  resetButton.addEventListener("click", () =>
    handleResetButton(constants, variables, {
      setDefaultTextColor,
      handleCalculateValues,
    })
  );

  // Initialize values at start
  handleCalculateValues(constants, variables, setDefaultTextColor);
};

// Add handler for VolSlideStep
document.addEventListener("DOMContentLoaded", handleVolSlideStep, false);
