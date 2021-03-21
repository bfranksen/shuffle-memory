const gameBoardCards = document.getElementById('game-board');
const selected = [];
const shiftEnum = Object.freeze({ 0: 'left', 1: 'up', 2: 'right', 3: 'down' });
let shift = '',
	turns = 0,
	matches = 0,
	shuffles = 0;

shiftLeft = () => {
	let index = 0;
	const array = [];
	const temp = Object.assign([], gameBoardCards.childNodes);
	for (let card of gameBoardCards.childNodes) {
		index = Array.from(gameBoardCards.childNodes).indexOf(card);
		if (index < 4) {
			array.push({ index: index + 12, div: card });
		} else {
			array.push({ index: index - 4, div: card });
		}
	}
	array.sort((a, b) => (a.index > b.index ? 1 : -1));
	for (let card of temp) {
		card.remove();
	}
	for (let card of array) {
		gameBoardCards.appendChild(card.div);
	}
};

shiftUp = () => {
	let order = '';
	for (let card of gameBoardCards.childNodes) {
		for (let c of card.classList) {
			if (c.startsWith('order')) {
				order = parseInt(c.substring(6));
				break;
			}
		}
		if (order === 1) {
			card.classList.toggle(`order-1`);
			card.classList.toggle(`order-4`);
		} else {
			card.classList.toggle(`order-${order}`);
			card.classList.toggle(`order-${order - 1}`);
		}
	}
};

shiftRight = () => {
	let index = 0;
	const array = [];
	const temp = Object.assign([], gameBoardCards.childNodes);
	for (let card of gameBoardCards.childNodes) {
		index = Array.from(gameBoardCards.childNodes).indexOf(card);
		if (index > 11) {
			array.push({ index: index - 12, div: card });
		} else {
			array.push({ index: index + 4, div: card });
		}
	}
	array.sort((a, b) => (a.index > b.index ? 1 : -1));
	for (let card of temp) {
		card.remove();
	}
	for (let card of array) {
		gameBoardCards.appendChild(card.div);
	}
};

shiftDown = () => {
	let order = '';
	for (let card of gameBoardCards.childNodes) {
		for (let c of card.classList) {
			if (c.startsWith('order')) {
				order = parseInt(c.substring(6));
				break;
			}
		}
		//- console.log(order);
		if (order === 4) {
			card.classList.toggle(`order-4`);
			card.classList.toggle(`order-1`);
		} else {
			card.classList.toggle(`order-${order + 1}`);
			card.classList.toggle(`order-${order}`);
		}
	}
};

getShiftDirection = () => {
	const num = Math.floor(Math.random() * 4);
	return shiftEnum[num];
};

shiftBoard = () => {
	switch (shift) {
		case 'left':
			shiftLeft();
			break;
		case 'up':
			shiftUp();
			break;
		case 'right':
			shiftRight();
			break;
		case 'down':
			shiftDown();
			break;
	}
};

setUpClasses = () => {
	const numItems = numCards;
	let cards = [];
	for (let i = 0; i < numItems; i++) {
		cards.push(i);
	}
	for (let i = cards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const temp = cards[i];
		cards[i] = cards[j];
		cards[j] = temp;
	}

	for (let i = 0; i < cards.length - 1; i += 2) {
		const card_one = document.getElementById(`card-${cards[i] + 1}`)
			.childNodes[0];
		const card_two = document.getElementById(`card-${cards[i + 1] + 1}`)
			.childNodes[0];
		const poke_class = `poke-bg-${i / 2 + 1}`;
		card_one.classList.add(poke_class);
		card_two.classList.add(poke_class);
	}

	for (let i = 0; i < cards.length; i++) {
		const el = document.getElementById(`card-${i + 1}`);
		const list = el.childNodes[0].classList;
		let name = '';
		for (let c of list) {
			if (c.startsWith('poke')) {
				name = c;
				break;
			}
		}
		el.addEventListener('click', () => {
			if (!el.classList.contains('active') && selected.length < 2) {
				list.toggle(name);
				list.toggle('card-front');
				list.toggle('card-back');
				el.classList.toggle('active');
				selected.push(el);
				if (selected.length > 1) {
					checkMatch();
				}
			}
		});
		// - list.toggle('card-back');
		list.toggle(name);
		list.toggle('card-front');
	}
	shift = getShiftDirection();
	document
		.querySelector('#next-shuffle i')
		.classList.toggle(`fa-arrow-${shift}`);
};

matchedCardReset = (node) => {
	const element = node.childNodes[0];
	element.classList.remove(...element.classList);
	node.classList.remove('active', 'matched-initial');
	node.classList.add('matched-final');
};

cardReset = (node) => {
	const element = node.childNodes[0];
	element.classList.remove(...element.classList);
	element.classList.add('mx-auto', 'card-back');
	node.classList.remove('active');
};

match = () => {
	selected[0].classList.toggle('matched-initial');
	selected[1].classList.toggle('matched-initial');
	selected[1].addEventListener(
		'transitionend',
		() => {
			setTimeout(() => {
				matchedCardReset(selected[0]);
				matchedCardReset(selected[1]);
				selected.splice(0, selected.length);
				document.querySelector('#matches span').innerHTML = ++matches;
			}, 1000);
		},
		{
			once: true,
		}
	);
};

unmatched = () => {
	setTimeout(() => {
		cardReset(selected[0]);
		cardReset(selected[1]);
		selected.splice(0, selected.length);
		document.querySelector('#shuffles span').innerHTML = ++shuffles;
		shiftBoard();
		document
			.querySelector('#next-shuffle i')
			.classList.toggle(`fa-arrow-${shift}`);
		shift = getShiftDirection();
		document
			.querySelector('#next-shuffle i')
			.classList.toggle(`fa-arrow-${shift}`);
	}, 750);
};

checkMatch = () => {
	let pokeOne,
		pokeTwo = '';
	for (const name of selected[0].childNodes[0].classList) {
		if (name.startsWith('poke')) {
			pokeOne = name;
			break;
		}
	}
	for (const name of selected[1].childNodes[0].classList) {
		if (name.startsWith('poke')) {
			pokeTwo = name;
			break;
		}
	}
	if (pokeOne === pokeTwo) {
		selected[1].addEventListener('transitionend', match, {
			once: true,
		});
	} else {
		selected[1].addEventListener('transitionend', unmatched, {
			once: true,
		});
	}
	document.querySelector('#turns span').innerHTML = ++turns;
};

(function () {
	// document.getElementById('left').addEventListener('click', () => {
	// 	shiftLeft(gameBoardCards);
	// });
	// document.getElementById('up').addEventListener('click', () => {
	// 	shiftUp(gameBoardCards);
	// });
	// document.getElementById('right').addEventListener('click', () => {
	// 	shiftRight(gameBoardCards);
	// });
	// document.getElementById('down').addEventListener('click', () => {
	// 	shiftDown(gameBoardCards);
	// });

	// getDirection(gameBoardCards);
	setUpClasses();
})();
