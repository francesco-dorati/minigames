<template>
  <div>
    <!-- menu -->
    <b-button
      class="menu__button"
      variant="secondary"
      v-b-modal.menu
    >
      <b-icon icon="list"/>
    </b-button>
    <!-- TODO!! make smaller buttons for smaller screens -->
    <b-modal id="menu" title="Game Menu" ref="menu" hide-header-close>
      <b-button
        variant="warning"
        block @click="playAgain"
      >
        <b-icon icon="arrow-repeat" class="mr-1"></b-icon>
        Restart Game
      </b-button>
      <b-button
        variant="danger"
        block @click="goLobby"
      >
        <b-icon icon="diagram3-fill" class="mr-1"></b-icon>
        Back to Lobby
      </b-button>
      <b-button
        variant="danger"
        block @click="goHome"
      >
        <b-icon icon="house-fill" class="mr-1"></b-icon>
        Return Home
      </b-button>

      <template #modal-footer="{}">
        <b-button
          variant="success"
          block @click="resume"
        >
          <b-icon icon="play-fill" class="mr-1"></b-icon>
          Resume
        </b-button>
      </template>
    </b-modal>

    <!-- deck and piletop -->
    <Center ref="center"/>

    <!-- bots -->
    <Bot
      v-for="player in otherPlayers"
      :key="player.index"
      ref="bot"
      :position="player.position"
      :index="player.index"
      :isPlayerTurn="turnId === player.index"
      @play="play"
      @next="nextTurn"
    />

    <!-- user hand -->
    <User
      ref="user"
      :isUserTurn="turnId === 0"
      @play="play"
      @next="nextTurn"
    />

    <!-- win modal -->
    <b-modal
      v-if="winner" ref="my-modal"
      header-class="modal__header" visible
      hide-footer no-close-on-backdrop hide-header-close
    >
      <template #modal-title>
        <span v-if="winner.index === 0">You have won!</span>
        <span v-else>{{winner.name}} has won!</span>
      </template>

      <b-button
        variant="success"
        block @click="playAgain"
      >
        <b-icon icon="arrow-repeat" class="mr-1"></b-icon>
        Play Again
      </b-button>
      <b-button
        variant="danger"
        block @click="goLobby"
      >
        <b-icon icon="diagram3-fill" class="mr-1"></b-icon>
        Return to Lobby
      </b-button>
      <b-button
        variant="danger"
        block @click="goHome"
      >
        <b-icon icon="house-fill" class="mr-1"></b-icon>
        Return Home
      </b-button>
    </b-modal>

  </div>
</template>

<script>
import User from './User.vue';
import Center from './Center.vue';
import Bot from './Bot.vue';

export default {
  name: 'SyngleplayerGame',

  components: {
    Center,
    User,
    Bot,
  },

  props: {
    playersNumber: { // number of players
      type: Number,
      required: true,
    },
    difficultyId: { // index of difficulty
      type: Number,
      required: true,
    },
    botSpeed: { // index of difficulty
      type: Number,
      required: true,
    },
    showPlayable: { // index of difficulty
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      // game
      // players: [], // list of players
      winner: null,

      // cards
      deck: [], // deck of cards
      colors: ['danger', 'warning', 'success', 'primary'], // card colors
      piletop: null, // piletop card

      // turn
      // TODO perfavore francesco di merda puoi cambiare chi inizia a giocare, grazie :)
      turnId: 0, // turn (id of player)
      isReversed: false, // reversed flag
      skipTurn: false, // skip flag
    };
  },

  methods: {
    // gameplay
    nextTurn() {
      if (!this.isReversed && this.turnId === this.playersNumber - 1) {
        this.turnId = 0;
      } else if (this.isReversed && this.turnId === 0) {
        this.turnId = this.playersNumber - 1;
      } else {
        this.turnId += this.isReversed ? -1 : 1;
      }
    },

    play(card) {
      // remove card from hand
      this.currentPlayer.hand.splice(this.currentPlayer.hand.indexOf(card), 1);

      // put card on piletop
      this.$refs.center.piletop = card;

      // check if he won
      if (this.currentPlayer.hand.length === 0) {
        // set the winner as the current player and close
        this.winner = this.currentPlayer;
        return;
      }

      // reset drawed cards
      this.$refs.user.raised = [];

      // check special cards
      if (card.value === 'reverse') { // reverse
        this.$refs.center.spinReverse = true;
        setTimeout(() => {
          this.$refs.center.spinReverse = false;
          this.isReversed = !this.isReversed; // inverse reversed flag
          this.nextTurn();
        }, 1000);
      } else if (card.value === 'skip') { // skip
        this.skipTurn = true; // set skip flag
        this.nextTurn();
      } else if (card.value === '+2') { // +2
        const drawed = this.$refs.center.draw(2);

        // next player draws 2 and skip
        this.nextPlayer.hand.push(...drawed);
        this.nextPlayer.hand.sort(this.sortHandler);

        this.$refs.user.raised = [...drawed];

        this.skipTurn = true;
        this.nextTurn();
      } else if (card.value === '+4') { // +4
        // next player draws 4 and skip
        const drawed = this.$refs.center.draw(4);

        this.nextPlayer.hand.push(...drawed);
        this.nextPlayer.hand.sort(this.sortHandler);

        this.$refs.user.raised = [...drawed];

        this.skipTurn = true;
        this.nextTurn();
      } else {
        // next turn
        this.nextTurn();
      }
    },

    // menu
    resume() {
      this.$refs.menu.hide();
    },

    playAgain() {
      this.$emit('playAgain');
    },

    goLobby() {
      this.$emit('goLobby');
    },

    goHome() {
      this.$emit('goHome');
    },

    // internal
    sortHandler(a, b) {
      const colors = ['danger', 'warning', 'success', 'primary', 'dark'];
      const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'reverse', 'skip', '+2', 'wild', '+4'];

      const areSameColor = colors.indexOf(a.color) - colors.indexOf(b.color) === 0;
      const areOrderedByColor = colors.indexOf(a.color) - colors.indexOf(b.color) < 0;
      const areOrderedByNumber = values.indexOf(a.value) - values.indexOf(b.value) <= 0;

      if (areSameColor) {
        // sort by values
        if (areOrderedByNumber) return -1; // correct (no swap)
        return 1; // wrong (swap)
      }

      if (areOrderedByColor) return -1;// correct (no swap)

      return 1; // wrong (swap)
    },

    isPlayable(card) {
      const isBlack = card.color === 'dark';
      const hasSameColor = card.color === this.$refs.center.piletop.color;
      const hasSameValue = card.value === this.$refs.center.piletop.value;
      const hasSameVariant = card.color === this.$refs.center.piletop.variant;

      return isBlack || hasSameColor || hasSameValue || hasSameVariant;
    },
  },

  computed: {
    // setup
    otherPlayers() {
      const response = [];
      const positions = ['left', 'top', 'right'];

      for (let i = 1; i < this.playersNumber; i += 1) {
        response.push({
          position: positions[this.playersNumber === 2 ? 1 : i - 1],
          index: i,
        });
      }

      return response;
    },

    // gameplay
    currentPlayer() {
      return this.turnId === 0 ? this.$refs.user.user : this.$refs.bot[this.turnId - 1].player;
    },

    nextPlayer() {
      let nextTurnId = this.turnId;
      if (!this.isReversed && nextTurnId === this.playersNumber - 1) nextTurnId = 0;
      else if (this.isReversed && nextTurnId === 0) nextTurnId = this.playersNumber - 1;
      else nextTurnId += this.isReversed ? -1 : 1;

      return nextTurnId === 0 ? this.$refs.user.user : this.$refs.bot[nextTurnId - 1].player;
    },
  },
};
</script>

<style>
.menu__button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
}

.modal-dialog {
  margin-top: 30vh;
  z-index: 10;
}
.modal-title {
  margin: auto;
}
</style>
