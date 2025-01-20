const pickerBtn = document.querySelector("#picker-btn");
const clearBtn = document.querySelector("#clear-btn");
const colorList = document.querySelector(".all-colors");

let pickedColors = JSON.parse(localStorage.getItem("color-list")) || [];
let currentPopUp = null;

const createColorPopup = (color) => {
    const popup = document.createElement('div');
    popup.classList.add('color-popup');
    popup.innerHTML = `
        <div class="color-popup-content">
            <div class="color-info">
                <div class="color-preview" style="background: ${color};"></div>
                <div class="color-details">
                    <div class="color-value">
                        <span class="label">Color:</span>
                        <span class="value">${color}</span>
                    </div>
                </div>
            </div>
            <span class="close-popup" onclick="closePopup()">×</span>
        </div>
    `;
    return popup;
};

const closePopup = () => {
    if (currentPopUp) {
        document.body.removeChild(currentPopUp);
        currentPopUp = null;
    }
};

// Show color list and attach event listeners
const showColors = () => {
    colorList.innerHTML = pickedColors.map((color) =>
        `
            <li class="color">
                <span class="rect" style="background: ${color}; border: 1px solid ${color === "#ffffff" ? "#ccc" : color}"></span>
                <span class="value" data-color="${color}">${color}</span>
            </li>
        `
    ).join("");

    const colorElements = document.querySelectorAll(".value");
    colorElements.forEach((span) => {
        span.addEventListener('click', (e) => {
            const color = e.currentTarget.dataset.color;

            // Remove the existing popup before creating a new one
            if (currentPopUp) {
                closePopup();
            }

            const popup = createColorPopup(color);
            document.body.appendChild(popup);
            currentPopUp = popup;
        });
    });

    const pickedColorsContainer = document.querySelector(".color-list");
    pickedColorsContainer.classList.toggle("hide", pickedColors.length === 0);
};

const activateEyeDropper = async () => {
    try {
        const { sRGBHex } = await new EyeDropper().open();

        if (!pickedColors.includes(sRGBHex)) {
            pickedColors.push(sRGBHex);
            localStorage.setItem("color-list", JSON.stringify(pickedColors));
        }

        showColors();
    } catch (error) {
        alert(error);
    }
};

const clearAll = () => {
    pickedColors = [];
    localStorage.removeItem("color-list");
    showColors();
};

// Add event listener to close the popup when clicking outside
document.addEventListener('click', (event) => {
    if (currentPopUp && !currentPopUp.contains(event.target)) {
        closePopup();
    }
});

pickerBtn.addEventListener('click', activateEyeDropper);
clearBtn.addEventListener('click', clearAll);

showColors();
