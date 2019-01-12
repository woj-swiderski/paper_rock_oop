'use strict';
/*
W shows the winner of the game:

  W[first_player_choice][second_player_choice] -> result

  results: 0 - draw, 1 - first player wins, 2 - second player wins
  choices: 0 - paper, 1 - scissors, 2 - stone (rock)

00 -> 0     10 -> 1     20 -> 2
01 -> 2     11 -> 0     21 -> 1
02 -> 1     12 -> 2     22 -> 0

*/


const msg = document.getElementById('msg');
msg.addEventListener('done', function(e){this.textContent = `clicked ${e.detail}`});

const msg2 = document.getElementById('msg2');
msg2.addEventListener('done', function(e){this.textContent = `clicked ${e.detail}`});

const W = [[0, 2, 1], [1, 0, 2], [2, 1, 0]];

const userRadios = document.getElementsByName('user');

for (let r of userRadios) {
    r.addEventListener('click', click);
    r.checked = false;
}

const params = { numberOfGames: 4 };


class User {

    constructor(){
        this.radios = [];
        this.sel = -1;
        this.history = [];

        const texts = ['Paper', 'Scissors', 'Rock'];
        const messages = ['It\'s a draw', 'You\'ve lost', 'You\'ve won'];

        this.messageField; // will be set later
        this.overlay; // will be set later
        this.form = document.createElement('form');
        this.field = document.createElement('fieldset');
        this.legend = document.createElement('legend');
        this.legend.textContent = 'Your choice';

        this.field.appendChild(this.legend);
        //~ this.field.addEventListener('userClicked', (e) => {
            //~ this.messageField.textContent = `${messages[User.findWinner(this.computerChoice(), e.detail)]}`});

        this.field.addEventListener('userClicked', function(e){
            let res = User.findWinner(this.computerChoice(), e.detail);
            this.history.push(res);
            this.messageField.textContent = `${messages[res]}`;
            if (this.history.length === params.numberOfGames) {
                this.field.dispatchEvent(new CustomEvent('gameOver', {bubbles: true, detail: this.history}))
            };
        }.bind(this)
        );

        this.field.addEventListener('gameOver', function(e){
            msg2.textContent = e.detail}.bind(this)
        );

        for (let i = 0; i < 3; i++){
            let inp = document.createElement('input');
            inp.type = 'radio';
            inp.id = `u_${i}`;
            inp.name = 'user';
            inp.value = i;
            inp.addEventListener('click',
                function(){
                    this.field.dispatchEvent(new CustomEvent('userClicked', {bubbles: true, detail: i}));
                    //~ msg2.textContent = i;
                }.bind(this));

            this.radios.push(inp);

            let lab = document.createElement('label');
            lab.setAttribute('for', inp.id);
            lab.innerHTML = `${texts[i]}<br>`;

            this.field.appendChild(inp);
            this.field.appendChild(lab);

        }
        this.form.appendChild(this.field);
        document.body.appendChild(this.form);
        this.messageField = this.createMessageField();
    }

    createMessageField(){
        const m = document.createElement('p');
        m.classList.add('messageBox');
        document.body.appendChild(m);
        return m;
    };

    createOverlay(){
        const o = document.createElement('div');
    };

    computerChoice(){
        return Math.floor(Math.random() * 3);
    }

    static findWinner(u, c){
        // 0 - draw, 1 - u wins, 2 - c wins

        const W = [[0, 2, 1], [1, 0, 2], [2, 1, 0]];
        switch (W[u][c]) {
            case 0:
                return 0;
                break;

            case 1:
                return 2;
                break;

            case 2:
                return 1
        }
    }

    done(){
        // ?
    };

}

const user = new User();


/*

    switch (W[u][c]) {
        case 0:
            mesg = 'It\'s a draw';
            params.draws += 1;
            break;

        case 1:
            mesg = 'You\'ve won';
            params.wins += 1;
            break;

        case 2:
            mesg = 'You\'ve lost';
            params.loses += 1;
            break;
    }


 */
