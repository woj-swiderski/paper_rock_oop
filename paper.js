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

const params = { numberOfGames: 4 };


class User {

    constructor(){
      this.radios = [];
      this.sel = -1;
      this.history = [];

      this.form;
      this.fieldset;

      this.messageField; // will be set later
      this.overlay; // will be set later

      this.createHtmlContent();
      this.createMessageField();
      this.createOverlay();
    }

    createHtmlContent() {
      const texts = ['Paper', 'Scissors', 'Rock'];
      const messages = ['It\'s a draw', 'You\'ve lost', 'You\'ve won'];

      this.form = document.createElement('form');
      this.fieldset = document.createElement('fieldset');

      const legend = document.createElement('legend');
      legend.textContent = 'Your choice';
      this.fieldset.appendChild(legend);

      for (let i = 0; i < 3; i++){
          let inp = document.createElement('input');
          inp.type = 'radio';
          inp.id = `u_${i}`;
          inp.name = 'user';
          inp.value = i;
          inp.checked = false;
          // radios wysyłają info do fieldseta
          inp.addEventListener('click',
              function(){
                  this.fieldset.dispatchEvent(new CustomEvent('userClicked', {bubbles: true, detail: i}));
                  msg2.textContent = i;
              }.bind(this));

          let lab = document.createElement('label');
          lab.for = inp.id;
          // lab.setAttribute('for', inp.id);
          lab.innerHTML = `${texts[i]}<br>`;

          this.radios.push(inp);
          this.fieldset.appendChild(inp);
          this.fieldset.appendChild(lab);
      }

      this.form.appendChild(this.fieldset)
      document.body.appendChild(this.form);

      //~ this.field.addEventListener('userClicked', (e) => {
          //~ this.messageField.textContent = `${messages[User.findWinner(this.computerChoice(), e.detail)]}`});

      this.fieldset.addEventListener('userClicked', function(e){
          let res = this.findWinner(this.computerChoice(), e.detail);
          this.history.push(res);
          this.messageField.textContent = `${messages[res]}`;
          if (this.history.length === parseInt(params.numberOfGames)) {
              this.fieldset.dispatchEvent(new CustomEvent('gameOver', {bubbles: true, detail: this.history}));
          }
        }.bind(this)
      );

      this.fieldset.addEventListener('gameOver', function(e){
          // msg2.textContent = e.detail;
          this.overlay.classList.replace('hidden', 'visible');
          this.
        }.bind(this)
      );

    }

    createMessageField() {
        this.messageField = document.createElement('p');
        this.messageField.classList.add('messageBox');
        document.body.appendChild(this.messageField);
    };

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay', 'hidden');
        document.body.appendChild(this.overlay);
    };

    computerChoice() {
        return Math.floor(Math.random() * 3);
    }

    findWinner(u, c){
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
