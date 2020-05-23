const { promisify } = require('util');
const sleep = promisify(setTimeout);

(async() => {
    // YOUNGEST GOES FIRST - ORDER OF AGE
    const players = [{
        name: 'Ansley',
        currentPlace: 0,
    }, {
        name: 'Ben',
        currentPlace: 0
    }, {
        name: 'Daddy',
        currentPlace: 0
    }, {
        name: 'Mommy',
        currentPlace: 0
    }];


    let playerTurn = 0; // THE CURRENT PLAYERS TURN

    const colorArray = ['r', 'p', 'y', 'b', 'o', 'g']; // ORDER OF SPACES/SQUARES ON BOARD

    const pictureSpaces = [{ label: 'peppermint', space: 21 }, { label: 'peanut', space: 33 }, { label: 'lollypop', space: 50 }, { label: 'icecream', space: 67 }];

    const totalSpaces = 83; //INCLUDES THE LAST RAINBOW SPACE - THIS IS JUST A REFERENCE
    const coloredSpaces = 78;

    // CARDS AND NUMBER OF EACH TYPE OF CARD
    const cardSets = [{
            color: 'b',
            times: 4
        },
        {
            color: 'p',
            times: 4
        },
        {
            color: 'y',
            times: 4
        },
        {
            color: 'r',
            times: 4
        },
        {
            color: 'o',
            times: 4
        },
        {
            color: 'g',
            times: 4
        },
        {
            color: 'bb',
            times: 3
        },
        {
            color: 'pp',
            times: 3
        },
        {
            color: 'yy',
            times: 3
        },
        {
            color: 'rr',
            times: 3
        },
        {
            color: 'oo',
            times: 3
        },
        {
            color: 'gg',
            times: 3
        },
        {
            color: 'peanut',
            times: 1
        },
        {
            color: 'lollypop',
            times: 1
        },
        {
            color: 'peppermint',
            times: 1
        },
        {
            color: 'icecream',
            times: 1
        }
    ]

    //CREATE THE CARD DECK
    let playingCardSet = [];
    for (let i = 0; i < cardSets.length; i++) {
        const cardSet = cardSets[i];
        for (let j = 0; j < cardSet.times; j++) {
            playingCardSet.push(cardSet.color);
        }
    }

    // CREATE THE BOARD
    let board = [];
    for (let i = 0; i < coloredSpaces; i += 1) {
        const obj = {
            square: colorArray[i % 6]
        }
        board.push(obj)
    }
    // ADD PICTURE SPACES TO THEIR SPECIFIED SPACE
    pictureSpaces.map((item) => {
        board[item.space] = {
            square: item.label
        }
    });



    // MOVE - COULD BE ONE OF TWO IF THE PLAY DREW A DOUBLE COLOR OTHERWISE SINGLE
    const move = async(play, playerIndx) => {
        // WE NEED TO ADD ONE TO THE PLAYER'S PLACE SO WE LOOK FORWARD ON DOUBLE SQUARES BECAUSE THAT SQUARE WILL BE COUNTED TWICE
        for (let j = players[playerIndx].currentPlace + 1; j < board.length; j += 1) {
            if (play === board[j].square) {
                players[playerTurn].currentPlace = j;
                break;
            }
        }
    }

    // PLAYER'S TURN
    const playTurn = async(card, playerIndx) => {
        try {
            let plays = null;
            // SINGLE AND DOUBLE HAVE LESS THAN 3 LETTERS
            if (card.length < 3) {
                // SPLIT THE CARD INTO PLAYS - DOUBLES TO WORRY ABOUT
                plays = card.split('');
            } else {
                // THIS IS A PICTURE SPACE
                // GO STRAIGHT TO THAT INDEX
                for (let i = 0; i < board.length; i++) {
                    if (card === board[i].square) {
                        players[playerIndx].currentPlace = i;
                    }
                }
                return;
            }
            for (let i = 0; i < plays.length; i++) {
                const play = plays[i];
                // ONE MOVE AT A TIME
                await move(play, playerIndx);
            }
            return;
        } catch (error) {
            console.log(error)
        }
    }


    // STARTING POINT

    // GET A FRESH DECK OF CARDS
    let playingCards = [...playingCardSet];

    // LOOP OVER X NUMBER OF TIMES - 1000 JUST BECAUSE
    for (let i = 0; i < 1000; i += 1) {
        // CHECK TO MAKE SURE THE DECK OF CARDS HAS ENOUGH OTHERWISE GET A NEW DECK
        if (playingCards.length === 0) {
            console.log('NEW DECK');
            playingCards = [...playingCardSet]
        }
        // PLAYER'S TURN
        playerTurn = i % players.length;
        // GET RANDOM CARD FROM DECK
        const cardIndx = Math.floor(Math.random() * playingCards.length);
        // GET CARD FROM DECK
        const card = playingCards[cardIndx];
        // REMOVE THE CARD SO ITS NOT PICKED AGAIN
        playingCards.splice(cardIndx, 1);
        // SET PLAYER'S CONST
        const player = players[playerTurn];
        // IF THE PLAYER IS CURRENTLY WITHIN THE 6TH SPACE THEN THIS TURN ENSURES THEY WIN
        const withIn = board.length - player.currentPlace;
        if (card.length < 3 && withIn <= 6) {
            console.log(`${player.name} WON!!`);
            break // STOP THE LOOP AND DECLARE THE WINNER
        }
        // CALL TO PLAY TURN
        await playTurn(card, playerTurn);
        // LET US KNOW WHERE THE PLAYER IS ON THE BOARD
        console.log(card, player.name, player.currentPlace);
        // WAIT SOMETIME SO AT LEAST THE GAME IS VISIBLE
        await sleep(1000);
    }
})()
