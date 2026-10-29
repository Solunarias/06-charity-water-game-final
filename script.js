const gameGrid = document.querySelector('#game-grid');
const scoreDisplay = document.querySelector('#score');
const directionArrow = document.querySelector('#direction-arrow span');
const winModal = document.querySelector('#win-modal');
const finalScore = document.querySelector('#final-score');
const resultMessage = document.querySelector('#result-message');
const confetti = document.querySelector('#confetti');
const playAgainButton = document.querySelector('#play-again');
const resetGameButton = document.querySelector('#reset-game');
const loadingScreen = document.querySelector('#loading-screen');
const loadingFact = document.querySelector('#loading-fact');
let score = 0;
const par = 4;
const goalCellNumber = Math.floor(Math.random() * 100);
const badCellNumbers = new Set();
const confettiColors = ['#003366', '#77a8bb', '#ffc907', '#bf6c46', '#fed8c1', '#cbccd1'];
const loadingFacts = [
	'696 million people lack basic access to clean and safe drinking water.',
	'Access to clean water and basic sanitation can save around 16,000 lives every week.',
	'Less time collecting water means more time in class. With access to clean water, kids around the world are 31% less likely to miss school.',
	'Worldwide, women and girls are responsible for collecting water in 70% of households. When a community receives clean water women get hours back in their day and take charge of their own futures.',
  'Every $1 invested in clean water can yield $4.30 in economic returns. Access to clean water is perhaps the single most powerful investment for sparking economic growth humanity has ever known.',
  'Charity Water has funded over 200,000 water projects in 29 countries, providing clean water to over 21 million people.',
  'Charity Water is a non-profit organization that brings clean and safe drinking water to people in developing countries.',
  'Charity Water has a 100% model, meaning that every dollar donated goes directly to funding water projects.',
  'Charity Water has a strong focus on transparency, providing detailed information about each water project they fund.',
  'Charity Water has a strong focus on sustainability, ensuring that the water projects they fund are maintained and continue to provide clean water for years to come.',
  'every donation counts, a $1 donation provides 1,100 liters of clean water, which is enough water to supply an average family for 12.5 days.'
];

const randomFactNumber = Math.floor(Math.random() * loadingFacts.length);
loadingFact.textContent = loadingFacts[randomFactNumber];

function hideLoadingScreen() {
	loadingScreen.classList.add('is-hidden');
	document.body.classList.remove('is-loading');
	loadingScreen.setAttribute('aria-hidden', 'true');
	window.setTimeout(function () {
		loadingScreen.hidden = true;
	}, 500);
}

window.addEventListener('load', function () {
	window.setTimeout(hideLoadingScreen, 5000);
});

while (badCellNumbers.size < 25) {
	const badCellNumber = Math.floor(Math.random() * 100);

	if (badCellNumber !== goalCellNumber) {
		badCellNumbers.add(badCellNumber);
	}
}

function pointArrowAtGoal(lastCellNumber) {
	const lastRow = Math.floor(lastCellNumber / 10);
	const lastColumn = lastCellNumber % 10;
	const goalRow = Math.floor(goalCellNumber / 10);
	const goalColumn = goalCellNumber % 10;
	const columnDifference = goalColumn - lastColumn;
	const rowDifference = goalRow - lastRow;

	if (columnDifference === 0 && rowDifference === 0) {
		directionArrow.parentElement.hidden = true;
		return;
	}

	const angle = Math.atan2(columnDifference, -rowDifference) * (180 / Math.PI);
	directionArrow.parentElement.hidden = false;
	directionArrow.style.transform = `rotate(${angle}deg)`;
}

function showWinScreen() {
	gameGrid.querySelectorAll('.grid-cell').forEach(function (gridCell) {
		gridCell.disabled = true;
	});
	finalScore.textContent = score;
	if (score <= par) {
		resultMessage.textContent = 'Great job! You found clean water, and on schedule too!';
	} else {
		resultMessage.textContent = 'Clean water found. The community can move forward, better late than never.';
	}
	if (score <= par) {
		showConfetti();
	}
	winModal.hidden = false;
	playAgainButton.focus();
}

function showConfetti() {
	for (let pieceNumber = 0; pieceNumber < 40; pieceNumber++) {
		const piece = document.createElement('span');
		const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];

		piece.className = 'confetti-piece';
		piece.style.left = `${Math.random() * 100}%`;
		piece.style.animationDelay = `${Math.random() * 1.5}s`;
		piece.style.backgroundColor = color;
		confetti.appendChild(piece);
	}
}

// Create 100 cells so the board always has 10 rows and 10 columns.
for (let cellNumber = 0; cellNumber < 100; cellNumber++) {
	const cell = document.createElement('button');

	cell.className = 'grid-cell';
	cell.type = 'button';
	cell.setAttribute('aria-label', `Grid cell ${cellNumber + 1}`);
	cell.addEventListener('click', function () {
		score++;
		scoreDisplay.textContent = score;
		cell.disabled = true;
		cell.classList.add('flipped');

		if (badCellNumbers.has(cellNumber)) {
			cell.classList.add('bad');
			directionArrow.parentElement.hidden = true;
			cell.setAttribute('aria-label', 'Dead end');
			return;
		}

		pointArrowAtGoal(cellNumber);

		if (cellNumber === goalCellNumber) {
			cell.classList.add('goal');
			cell.setAttribute('aria-label', 'Clean water found');
			const waterCan = document.createElement('img');
			waterCan.className = 'water-can';
			waterCan.src = 'img/water-can-transparent.png';
			waterCan.alt = '';
			waterCan.setAttribute('aria-hidden', 'true');
			cell.appendChild(waterCan);
			showWinScreen();
		}
	});
	gameGrid.appendChild(cell);
}

playAgainButton.addEventListener('click', function () {
	window.location.reload();
});

resetGameButton.addEventListener('click', function () {
	window.location.reload();
});
