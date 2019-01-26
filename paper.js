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

const messages = ['It\'s a draw', 'You\'ve won', 'You\'ve lost'];
const texts = ['Paper', 'Scissors', 'Rock'];

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
              }.bind(this));

          let lab = document.createElement('label');
          lab.setAttribute('for', inp.id);
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
          let c = this.computerChoice();
          let res = this.findWinner(c, e.detail);
          this.history.push([e.detail, c, res]);
          this.messageField.textContent = `${messages[res]}`;
          if (this.history.length === parseInt(params.numberOfGames)) {
              this.fieldset.dispatchEvent(new CustomEvent('gameOver', {bubbles: true, detail: this.history}));
          }
        }.bind(this)
      );

      this.fieldset.addEventListener('gameOver', function(e){
          const table = document.createElement('table');
          const th = document.createElement('tr');
          for (let h of ['you', 'computer', 'result']) {
            const td = document.createElement('th');
            td.innerText = h;
            th.appendChild(td);
          }
          table.appendChild(th);
          for (let h of this.history){
            const row = document.createElement('tr');
            let i = 0;
            for (let c of h){
              i++;
              const td = document.createElement('td');
              td.innerText = (i === 3 ? messages[c] : texts[c]);
              row.appendChild(td);
            }
            table.appendChild(row);
          }
          const p = document.createElement('tr');
          p.innerHTML = `<td colspan=3>${this.gameWinner()}</td>`;
          table.appendChild(p);

          this.overlay.classList.replace('hidden', 'visible');
          this.overlay.appendChild(table);
          this.messageField.classList.add('hidden');
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
        this.overlay.addEventListener('click', ()=>{
          this.overlay.innerHTML = '';
          this.overlay.classList.replace('visible', 'hidden')
        }
        );
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

    gameWinner() {
      let you, comp;
      you = comp = 0;
      for (let [ , , i] of this.history) {
        if (i &&  i === 1) {
          you++
        }
        else if (i &&  i === 2) {
          comp++
        }
      }
      if (you === comp) {
        return 'The game is a draw'
      }
      return you < comp ? 'You\'ve lost the game' : 'You\'ve won the game'
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
