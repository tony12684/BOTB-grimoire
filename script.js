class Circle {
  constructor(
    id,
    radial,
    theta,
    diameter,
    textSize = 3,
    name = "Player",
    selectState = "1",
  ) {
    // console.log(
    //   `Creating circle at radial: ${radial}, theta: ${theta}, diameter: ${diameter}, name: ${name}`,
    // );
    // create circle div
    let div = document.createElement("div");
    div.className = "circle";
    div.style.width = diameter + "vmin";
    div.style.height = diameter + "vmin";

    // Store properties on the div element so we can access them later
    div.id = id;
    div.radial = radial;
    div.theta = theta;
    div.diameter = diameter;
    div.selectState = selectState; // unselected state default
    // use selectState 2 for selected and state 0 for unselectable

    // Set on click method
    div.addEventListener("click", toggleSelection);

    // add background image
    let image = document.createElement("img");
    image.src = "./images/textures/paper-circle.png";
    image.style.width = "85%";
    div.appendChild(image);

    // add role or block image
    // TODO: show these selectively
    // for testing, show all of them overlapping to make sure they resize properly
    image = document.createElement("img");
    // count images in the roles folder
    let hide = {
      /*
            const roles = [
                'baron.png',
                'butler.png',
                'chef.png',
                'empath.png',
                'fortuneteller.png',
                'imp.png',
                'investigator.png',
                'librarian.png',
                'mayor.png',
                'monk.png',
                'poisoner.png',
                'ravenkeeper.png',
                'recluse.png',
                'saint.png',
                'scarletwoman.png',
                'slayer.png',
                'soldier.png',
                'spy.png',
                'undertaker.png',
                'virgin.png',
                'washerwoman.png'
            ]
            // for each image in the roles folder, add it to the circle
            //for (let i = 0; i < roles.length; i++) {
            //    console.log(`Adding role image: ${roles[i]}`);
            //    image = document.createElement("img");
            //    image.src = `./images/roles/${roles[i]}`;
            //    image.style.width = "115%";
            //    image.style.opacity = 0.5;
            //    div.appendChild(image);
            //}
        */
    };
    image.src = "./images/roles/imp.png";
    // 115% seems to work well
    image.style.width = "115%";
    div.appendChild(image);

    // add half transparent shadow for text visibility
    let shadow = document.createElement("div");
    shadow.classList.add("text-shadow");
    shadow.style.position = "absolute";
    shadow.style.height = "0.1vmin";
    shadow.style.backgroundColor = "rgba(0, 0, 0, .66)";
    div.appendChild(shadow);

    // add name text
    let text = document.createElement("text");
    text.innerText = name;
    text.style.fontSize = textSize + "vmin";
    shadow.appendChild(text);
    console.log(
      "Created circle",
      //`Created circle at radial: ${div.radial}, theta: ${div.theta}, diameter: ${div.diameter}`,
    );
    return div;
  }
}

function getParentCircle(element) {
  if (element.className === "circle") {
    return element;
  } else if (element.tagName === "BODY" || element.tagName === null) {
    throw new Error(
      "'circle' class not found in element structure in getParentCircle()",
    );
  } else {
    return getParentCircle(element.parentElement);
  }
}

function toggleSelection(event) {
  console.log("Toggling selection...");
  try {
    console.log("You clicked: ", event.target);
    circleDiv = getParentCircle(event.target);
    console.log("circle div: ", circleDiv);
    console.log("circleDiv.selectState: ", circleDiv.selectState);
    if (circleDiv.selectState == 1) {
      circleDiv.selectState = 2;
      circleDiv.style.backgroundColor = "var(--selected-color)";
    } else if (circleDiv.selectState == 2) {
      circleDiv.selectState = 1;
      circleDiv.style.backgroundColor = "var(--unselected-color)";
    }
    console.log("Selection toggled successfully");
  } catch (e) {
    alert("error: " + e);
  }
}

function checkCircleOverlapPolar(r1, theta1, R1, r2, theta2, R2) {
  console.log("Checking circle overlap...");
  //console.log(`Checking overlap: Circle 1 (r=${r1}, theta=${theta1}, R=${R1}), Circle 2 (r=${r2}, theta=${theta2}, R=${R2})`);
  // Convert polar coordinates to Cartesian coordinates
  const x1 = r1 * Math.cos(theta1);
  const y1 = r1 * Math.sin(theta1);
  const x2 = r2 * Math.cos(theta2);
  const y2 = r2 * Math.sin(theta2);

  // Calculate the distance between the centers
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Check for overlap
  // If the distance is less than or equal to the sum of the radii, they overlap.
  const sumOfRadii = R1 + R2 + 0.15; // add a small buffer to prevent visual overlap
  return distance <= sumOfRadii;
}

function resizeCircles(circles) {
  let overlap = false;
  console.log("resizing circles...");
  do {
    overlap = checkCircleOverlapPolar(
      circles[0].radial,
      circles[0].theta,
      circles[0].diameter / 2,
      circles[1].radial,
      circles[1].theta,
      circles[1].diameter / 2,
    );
    //console.log("overlap: " + overlap);
    if (overlap) {
      //console.log("repositioning circles");
      // reposition circles
      for (let i = 0; i < circles.length; i++) {
        circles[i].style.width = circles[i].diameter - 0.1 + "vmin";
        circles[i].style.height = circles[i].diameter - 0.1 + "vmin";
        circles[i].diameter -= 0.1;
      }
    }
  } while (overlap);
  console.log("circles resized successfully");
}

function resizeTexts(circles) {
  console.log("resizing texts...");
  for (let i = 0; i < circles.length; i++) {
    let text = circles[i].getElementsByTagName("text")[0];
    let textSize = parseFloat(text.style.fontSize);
    let textLength = text.innerText.length;
    // the 0.6 is an empirically derived constant that seems to work well for fitting text within circles
    while (textSize * textLength * 0.6 > circles[i].diameter) {
      textSize -= 0.1;
      text.style.fontSize = textSize + "vmin";
    }
  }
  console.log("texts resized successfully");
}

function isElementContainedVerticaly(element1, element2) {
  // returns true if element1 is vertically contained in element2
  // assume they are both centered vertically
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return rect1.height < rect2.height;
}

function resizeTextShadow(circles) {
  //for each circle make the text contained
  console.log("resizing text shadow...");
  console.log("circles: ", circles);
  try {
    Array.from(circles).forEach((circle) => {
      let contained = false;
      do {
        // TODO: switch this to a query selector for text
        let text = circle.querySelectorAll("text")[0];
        let shadow = circle.querySelectorAll(".text-shadow")[0];
        //console.log("text: ", text);
        //console.log("shadow: ", shadow);
        contained = isElementContainedVerticaly(text, shadow);
        if (!contained) {
          //increase shadow
          // console.log("shadow height: ", shadow.style.height);
          // console.log(
          //   "text rect height: ",
          //   text.getBoundingClientRect().height,
          // );
          // console.log(
          //   "shadow rect height: ",
          //   shadow.getBoundingClientRect().height,
          // );
          shadow.style.height = parseFloat(shadow.style.height) + 0.1 + "vmin";
          // console.log(shadow.style.height);
        }
      } while (!contained);
    });
    console.log("text shadows resized successfully");
  } catch (e) {
    alert("error in resizeTextShadow: " + e);
  }
}

function doDivsOverlap(div1, div2) {
  console.log("Checking overlap between div1 and div2");
  const rect1 = div1.getBoundingClientRect();
  const rect2 = div2.getBoundingClientRect();

  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.left > rect2.right ||
    rect1.right < rect2.left
  );
}

function resizePrompt(prompt, submit) {
  console.log("resizing prompt...");
  // Calculate vmin in pixels: 1vmin = 1% of smaller viewport dimension
  const vminInPixels = Math.min(window.innerWidth, window.innerHeight) / 100;
  // Get the computed font size in pixels and convert to vmin
  let fontSizeInPixels = parseFloat(window.getComputedStyle(prompt).fontSize);
  let fontSize = fontSizeInPixels / vminInPixels;
  // Add a safety counter to prevent infinite loops
  let maxIterations = 100;
  let iterations = 0;
  // check for overlap
  while (doDivsOverlap(prompt, submit) && iterations < maxIterations) {
    fontSize -= 0.1;
    prompt.style.fontSize = fontSize + "vmin";
    iterations++;
  }
  // show the prompt after resizing to prevent flashes of unstyled content
  prompt.style.visibility = "visible";
  console.log(`Resized prompt in ${iterations} iterations`);
  console.log("Final prompt font size: " + prompt.style.fontSize);
}

function submitChoices() {
  //get all children of the radial container element with the circle class
  let radial = document.getElementsByClassName("radial-container")[0];
  let circles = radial.querySelectorAll(".circle");

  // for each toggled circle, append their id to the msg
  let msg = "";
  circles.forEach((circle) => {
    if (circle.selectState == 2) {
      console.log("Adding to msg, circle.id: ", circle.id);
      msg += String(circle.id) + ",";
    }
  });

  // if we added any items, remove the trailing ',' delimiter
  if (msg.length > 0) {
    msg = msg.slice(0, -1);
  }
  console.log("msg: ", msg);

  alert("Submitted circles: " + msg);
}

function makeCircles(radius, players, maxCircleSize) {
  console.log("Making circles...");
  try {
    // load all circles
    let radial = document.getElementsByClassName("radial-container")[0];

    // set the angle increment
    let angleIncrement = 360 / players;

    // create circles
    for (let i = 0; i < players; i++) {
      let angle = angleIncrement * i; // get angle in degrees
      angle = angle * (Math.PI / 180); // convert to radians
      angle = 2 * Math.PI - angle; // invert angle for correct direction
      //angle is now the radian position of the circle,
      //  using polar coordinates, but with 0 at THE TOP
      let name = `Player`; // placeholder name test
      radial.appendChild(new Circle(i, radius, angle, maxCircleSize, 3, name));
    }

    // count them
    //  use count just in case we want to modify the player count later
    let circles = radial.querySelectorAll(".circle");
    console.log("circles: ", circles);
    let count = circles.length;
    // for each circle, transform by angle * index
    for (let i = 0; i < count; i++) {
      let angle = angleIncrement * i - 90;
      if (angle < 0) {
        angle += 360;
      }
      circles[i].style.transform =
        `rotate(${angle}deg) translate(${radius}vmin) rotate(-${angle}deg)`;
    }
    console.log("Circles made successfully");
    return circles;
  } catch (e) {
    alert("error in makeCircles: " + e);
  }
}

function makeCornerButtons(maxCircleSize) {
  console.log("Making corner buttons...");
  let buttonSize = maxCircleSize * 0.8;
  let buttonDistance = 50 - (buttonSize / 2 + 1);
  try {
    let corners = [
      { name: "Settings", position: 0 },
      { name: "Quick Actions", position: 1 },
      { name: "Reminders", position: 2 },
      { name: "History", position: 3 },
    ];
    let radial = document.getElementsByClassName("radial-container")[0];
    corners.forEach((corner) => {
      let button = document.createElement("div");
      button.className = "subCircle";
      button.style.width = buttonSize + "vmin";
      button.style.height = buttonSize + "vmin";
      let angle = 90 * corner.position;
      button.style.transform = `rotate(${angle}deg) translate(${buttonDistance}vmin) rotate(-90deg) translate(${buttonDistance}vmin) rotate(90deg) rotate(-${angle}deg)`;
      let text = document.createElement("text");
      text.innerText = corner.name;
      text.style.fontSize = buttonSize / 6 + "vmin";
      text.style.color = "white";
      text.style.textAlign = "center";
      text.style.lineHeight = 1.2;
      button.appendChild(text);
      radial.appendChild(button);
    });
    console.log("Corner buttons made successfully");
  } catch (e) {
    alert("error: " + e);
  }
}

function loadPage() {
  console.log("Loading page...");
  try {
    const radius = 35; // in vmin
    const numPlayers = 8; // count
    const maxCircleSize = 16; // in vmin
    const circles = makeCircles(radius, numPlayers, maxCircleSize);
    makeCornerButtons(maxCircleSize);
    resizeCircles(circles);
    resizeTexts(circles);
    resizeTextShadow(circles);
    let prompt = document.getElementsByClassName("action-prompt-text")[0];
    let submit = document.getElementsByClassName("submit-button")[0];
    resizePrompt(prompt, submit);
    console.log("Page loaded successfully");
  } catch (e) {
    alert("error in loadPage: " + e);
  }
}

var originalTitle = document.title;
var intervalId; // Variable to store the interval ID
function startFlash() {
  var newTitle = "❗❗❗❗❗"; // The new title to flash

  const mySound = new Audio("./sounds/Bell_use1.ogg");

  // Set an interval to toggle the title every 1000ms (1 second)
  intervalId = setInterval(function () {
    if (!document.hasFocus()) {
      //mySound.play();
      if (document.title === originalTitle) {
        document.title = newTitle;
      } else {
        document.title = originalTitle;
      }
    }
    //mySound.play();
  }, 500); // Adjust the interval speed as needed
}

function stopFlash() {
  clearInterval(intervalId); // Stop the interval
  document.title = originalTitle; // Restore the original title
}
startFlash(); // Call this function to start flashing the title

window.onload = loadPage;
