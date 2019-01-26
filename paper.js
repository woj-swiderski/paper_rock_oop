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
const W = [[0, 2, 1], [1, 0, 2], [2, 1, 0]];

const messages = ['It\'s a draw', 'You\'ve won', 'You\'ve lost'];
const newGameMsg = 'Press \'New game\' and set number of games';
const texts = ['Paper', 'Scissors', 'Rock'];


class User {

    constructor(numberOfGames){
      this.radios = [];   // filled by createHtmlContent
      this.history = [];  // for round results
      this.numberOfGames = 0;

      this.form;      // will be set by createHtmlContent
      this.fieldset;  // will be set by createHtmlContent
      this.newgameButton;   // will be set by createHtmlContent
      this.newgameInput;  // will be set by createHtmlContent
      this.newgameParamsOK; // will be set by createHtmlContent

      this.closeOverlayButton;  //// will be set by createHtmlContent

      this.messageField;  // will be set by createMessageField
      this.overlay;       // will be set by createOverlay

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
      //legend done

      // now create radios
      for (let i = 0; i < 3; i++) {
          let inp = document.createElement('input');
          inp.type = 'radio';
          inp.id = `u_${i}`;
          inp.name = 'user';
          inp.value = i;
          inp.checked = false;
          // radios send info to fieldset
          inp.addEventListener('click',
              function(){
                  this.fieldset.dispatchEvent(new CustomEvent('userClicked', {bubbles: true, detail: i}));
              }.bind(this));

          // now labels for radios
          let lab = document.createElement('label');
          lab.setAttribute('for', inp.id);
          lab.innerHTML = `${texts[i]}<br>`;

          // in appears that this.radios list is not necessary. to be removed in next verion :-)
          this.radios.push(inp);
          this.fieldset.appendChild(inp);
          this.fieldset.appendChild(lab);
      } // radios done

      // I guess in next version there should be a container instead of body
      this.form.appendChild(this.fieldset)
      document.body.appendChild(this.form);
      // form done

      // this button will always be visible
      this.newgameButton = document.createElement('button');
      this.newgameButton.textContent = 'New game';
      this.newgameButton.addEventListener('click', this.newGame.bind(this));
      document.body.appendChild(this.newgameButton);
      // done

      // this button is created but inserted only when needed
      this.newgameParamsOK = document.createElement('button');
      this.newgameParamsOK.textContent = 'OK';
      this.newgameParamsOK.addEventListener('click', ()=>{
        // set value
        this.numberOfGames = this.newgameInput.value;
        // hide overlay
        this.overlay.classList.replace('visible', 'hidden');
        this.messageField.textContent = 'Start playing';
        // remove children of overlay so they are not visible
        this.newgameInput.remove();
        this.closeOverlayButton.remove();
        this.newgameParamsOK.remove();
      });
      // done

      // this button is created but inserted only when needed to an overlay
      this.closeOverlayButton = document.createElement('button');
      this.closeOverlayButton.textContent = 'Close';
      this.closeOverlayButton.addEventListener('click', ()=>{
        this.overlay.classList.replace('visible', 'hidden');
        // overlay may have a table as a child. how to delete it?
        // overlay has also closeOverlayButton as a child
        this.overlay.innerHTML = '';  // ????????????
      });
      // done

      // this button is created but inserted only when needed to an overlay
      this.newgameInput = document.createElement('input');
      this.newgameInput.setAttribute('type', 'number');
      this.newgameInput.min = 4;
      this.newgameInput.max = 12;
      this.newgameInput.value = 4;
      // done

      // should be next to fieldset ?
      this.fieldset.addEventListener('userClicked', function(e){
        // this.numberOfGames = 0  -> game is not initialised
          if (!this.numberOfGames) {
            return
          }
          // else
          let c = this.computerChoice();
          let res = this.findWinner(c, e.detail);
          // save result
          this.history.push([e.detail, c, res]);
          // show message
          this.messageField.textContent = `${messages[res]}`;
          // test if end of game
          if (this.history.length === parseInt(this.numberOfGames)) {
              this.fieldset.dispatchEvent(new CustomEvent('gameOver', {bubbles: true, detail: this.history}));
          }
        }.bind(this)  // maybe use arrow function insted?
      );

      this.fieldset.addEventListener('gameOver', function(e){
        // table will be added dynamically to overlay and then deleted by closeOverlayButton
          const table = document.createElement('table');
          // create header
          const th = document.createElement('tr');
          for (let h of ['you', 'computer', 'result']) {
            const td = document.createElement('th');
            td.innerText = h;
            th.appendChild(td);
          }
          table.appendChild(th);
          // header done
          // now rows
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
          // done
          // final row with results summary
          const p = document.createElement('tr');
          p.innerHTML = `<td colspan=3>${this.gameWinner()}</td>`;
          table.appendChild(p);
          // done

          this.history = [];
          this.numberOfGames = 0;
          this.messageField.textContent = newGameMsg;

          this.overlay.classList.replace('hidden', 'visible');
          this.overlay.appendChild(table);
          // this button will destroy table and remove itself from overlay
          this.overlay.appendChild(this.closeOverlayButton);
        }.bind(this)
      );
    }

    newGame() {
      // maybe this should reset this.history and this.numberOfGames ?
      this.overlay.classList.replace('hidden', 'visible');
      this.overlay.appendChild(this.newgameInput);
      this.overlay.appendChild(this.newgameParamsOK);
      this.overlay.appendChild(this.closeOverlayButton);
    }

    createMessageField() {
        this.messageField = document.createElement('p');
        this.messageField.classList.add('messageBox');
        this.messageField.textContent = newGameMsg;
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
