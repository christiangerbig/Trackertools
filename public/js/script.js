// Handler for main part
const handleMainPart = () => {
  
  // Load cat meow sound
  const loadCatMeowSound = () => {

    // Handler for load cat meow sound
    const handleCatMeowSoundLoad = () => {
      catMeowSound.removeEventListener(
        "load",
        handleCatMeowSoundLoad
      );
    }
    // Add handler for load cat meow sound
    const catMeowSound = new Audio("./sounds/cute-cat-meow.mp3");
    catMeowSound.addEventListener(
      "load",
      handleCatMeowSoundLoad
    );
    return catMeowSound;
  }
  const catMeowSound = loadCatMeowSound();

  // Handler for playing cat meow sound
  const handlePlayCatMeowSound = () => {
    catMeowSound.play();
  }
  let gitHubLinkElement = document.querySelector("#gitHubLink");
  // Add handler for playing cat meow sound
  gitHubLinkElement.addEventListener(
    "click",
    handlePlayCatMeowSound
  );
  // Add handler for playing cat meow sound for mobile phone
  gitHubLinkElement.addEventListener(
    "touchstart",
    handlePlayCatMeowSound
  );

}
// Add handler for main part
document.addEventListener(
  "DOMContentLoaded",
  handleMainPart,
  false
);