const gameBoardCards = document.getElementById('game-board');
let numSelected = 0;

shiftLeft = (gameBoardCards) => {
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

shiftUp = (gameBoardCards) => {
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

shiftRight = (gameBoardCards) => {
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

shiftDown = (gameBoardCards) => {
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

getDirection = (gameBoardCards) => {
	const num = Math.floor(Math.random() * 4);
	switch (num) {
		case 0:
			shiftLeft(gameBoardCards);
			break;
		case 1:
			shiftUp(gameBoardCards);
			break;
		case 2:
			shiftRight(gameBoardCards);
			break;
		case 3:
			shiftDown(gameBoardCards);
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
			if (!el.classList.contains('active')) {
				list.toggle(name);
				list.toggle('card-front');
				list.toggle('card-back');
				el.classList.toggle('active');
				numSelected++;
				if (numSelected > 1) {
					document.querySelector('main').classList.toggle('freeze');
					checkMatch(el);
				}
			}
		});
		// - list.toggle('card-back');
		list.toggle(name);
		list.toggle('card-front');
	}
};

checkMatch = () => {
	let pokeOne,
		pokeTwo = '';
	const selected = [];
	for (const el of gameBoardCards.childNodes) {
		if (el.childNodes[0].classList.contains('active')) {
			selected.push(el.childNodes[0]);
		}
	}
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
		selected[0].classList.toggle('matched-initial');
		selected[1].classList.toggle('matched-initial');
		console.log(selected[0]);
		selected[1].addEventListener('transitionend', () => {
			console.log('transitioned!');
			document.querySelector('main').classList.toggle('freeze');
		});
		return;
	}
	selected[0].childNodes[0].classList.toggle(pokeOne);
	selected[1].childNodes[0].classList.toggle(pokeTwo);
	selected[0].childNodes[0].classList.toggle('card-front');
	selected[1].childNodes[0].classList.toggle('card-front');
	selected[0].childNodes[0].classList.toggle('card-back');
	selected[1].childNodes[0].classList.toggle('card-back');
	selected[0].classList.toggle('active');
	selected[1].classList.toggle('active');
	document.querySelector('main').classList.toggle('freeze');
	numSelected = 0;
};

(function () {
	document.getElementById('left').addEventListener('click', () => {
		shiftLeft(gameBoardCards);
	});
	document.getElementById('up').addEventListener('click', () => {
		shiftUp(gameBoardCards);
	});
	document.getElementById('right').addEventListener('click', () => {
		shiftRight(gameBoardCards);
	});
	document.getElementById('down').addEventListener('click', () => {
		shiftDown(gameBoardCards);
	});

	// getDirection(gameBoardCards);
	setUpClasses();
})();
