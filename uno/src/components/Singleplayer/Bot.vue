<template>
  <!-- TODO fix css -->
  <div
    class="player__card--container"
    :style="{
      bottom: position === 'top' ? null : 0,
      left: position === 'right' ? null : 0,
      right: position === 'left' ? null : 0,
      flexDirection: position === 'top' ? 'row' : 'column',
    }"
  >
    <b-card
      v-for="(card, index) in player.hand"
      :key="card.id"
      :class="`
        player__card
        ${raisedClass(index)}
        ${position === 'top' ? 'player__card--top' : 'player__card--side'}
      `"
      :bg-variant="cardColor" text-variant="white"
    >

    </b-card>
    <div
      :class="`player__info ${position === 'top' ? 'player__info--top' : 'player__info--side'}`"
      :style="{
        marginTop: position === 'top' ? null : '15px',
      }"
    >
      <div class="player__stats">
        <b-icon
          v-if="statsMessage === 'skip'" class="mb-1"
          icon="slash-circle"  scale="1.2"
        />
        <span v-else>{{ statsMessage }}</span>
      </div>

      <div class="player__name">
        {{ player.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bot',

  props: {
    position: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    isPlayerTurn: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      player: {
        index: this.index,
        name: `Bot ${this.index}`,
        hand: this.$parent.$refs.center.draw(7).sort(this.$parent.sortHandler),
      },
      drawed: null,
    };
  },

  methods: {
    // refactor
    playAI() {
      // TODO refactor playAI
      // - add if piletop has the same number as different color number
      //        if the color is greater than the piletop's color play it
      // - create a value for every card and play the most valuable

      const playableCards = this.player.hand
        .filter((card) => this.$parent.isPlayable(card));

      // check if has playable cards
      if (playableCards.length) {
        let selectedCard;

        // on medium
        const p4Index = this.$parent.difficultyId >= 1
          ? (playableCards.reduce((result, card, index) => (card.value === '+4' ? index : result), null))
          : null;

        // on medium
        const p2Index = this.$parent.difficultyId >= 1
          ? (playableCards.reduce((result, card, index) => (card.value === '+2' ? index : result), null))
          : null;

        // on hard
        const skipIndex = this.$parent.difficultyId === 2
          ? (playableCards.reduce((result, card, index) => (card.value === 'skip' ? index : result), null))
          : null;

        // const sameValueNotColorIndex = playableCards
        //   .reduce((result, card, index) => (
        //     card.value === this.piletop.value && card.color !== this.piletop.color
        //       ? index : result
        //   ), -1);

        // const isMajorColor = this.chooseColorAI
        // === playableCards[sameValueNotColorIndex].color;

        // if (sameValueNotColorIndex !== -1 && isMajorColor)
        // const majorColorIndex = playableCards
        // if you have a card with same number and choose color

        if (p4Index !== null) { // if has +4 select it
          selectedCard = playableCards[p4Index];
        } else if (p2Index !== null) { // if has +2 select it
          selectedCard = playableCards[p2Index];
        } else if (skipIndex !== null) { // if has skip select it
          selectedCard = playableCards[skipIndex];
        } else { // else select the first playable card
          [selectedCard] = playableCards;
        }

        if (selectedCard.color === 'dark') { // if the selected card is black
          selectedCard.variant = this.chooseColorAI; // choose its color
        }

        // play the selcted card
        setTimeout(() => {
          this.$emit('play', selectedCard);
        }, this.$parent.botSpeed);
      } else {
        // if has no cards -> wait, draw, [skip | wait, play]
        // draw
        setTimeout(() => {
          this.drawed = this.$parent.$refs.center.draw();

          // put in hands
          this.player.hand.push(this.drawed);
          this.player.hand.sort(this.$parent.sortHandler);

          if (this.$parent.isPlayable(this.drawed)) {
            // if the drawed card is black choose its color
            if (this.drawed.color === 'dark') {
              this.drawed.variant = this.chooseColorAI;
            }

            // play the card
            setTimeout(() => {
              this.$emit('play', this.drawed);
              this.drawed = null;
            }, this.$parent.botSpeed);
          } else {
            // change turn
            setTimeout(() => {
              this.$emit('next');
              this.drawed = null;
            }, this.$parent.botSpeed);
          }
        }, this.$parent.botSpeed);
      }
      // }, this.$parent.botSpeed);
    },

    raisedClass(index) {
      let indexes = [];

      if (this.statsMessage === '+4') {
        indexes = [
          this.player.hand.length - 1,
          this.player.hand.length - 2,
          this.player.hand.length - 3,
          this.player.hand.length - 4,
        ];

        return indexes.includes(index) ? 'raised' : '';
      }

      if (this.statsMessage === '+2') {
        indexes = [
          this.player.hand.length - 1,
          this.player.hand.length - 2,
        ];

        return indexes.includes(index) ? 'raised' : '';
      }

      if (this.statsMessage === '+1') {
        indexes = [this.player.hand.length - 1];

        return indexes.includes(index) ? 'raised' : '';
      }

      return '';
    },
  },

  computed: {
    chooseColorAI() { // returns the name of the major color (default: 'danger')
      const colorsQuantity = this.$parent.colors // [danger, wanring, success, primary]
        .map((color) => this.player.hand
          .reduce((n, card) => (card.color === color ? n + 1 : n), 0));

      return this.$parent.colors[colorsQuantity.indexOf(Math.max(...colorsQuantity))];
    },

    statsMessage() {
      if (this.player.hand.length === 0) return '🎉'; // if he won
      if (this.drawed) return '+1'; // if he drawed one
      if (this.isPlayerTurn && this.$parent.skipTurn && this.$parent.$refs.center.piletop.value === '+4') return '+4'; // if he drawed 4
      if (this.isPlayerTurn && this.$parent.skipTurn && this.$parent.$refs.center.piletop.value === '+2') return '+2'; // if he drawed 2
      if (this.isPlayerTurn && this.$parent.skipTurn) return 'skip'; // if he skipped turn
      return this.player.hand.length; // else
    },

    cardColor() {
      return this.isPlayerTurn && !this.$parent.skipTurn && !this.$parent.$refs.center.spinReverse
        ? 'danger'
        : 'secondary';
    },
  },

  watch: {
    isPlayerTurn(val) {
      if (val) {
        if (this.$parent.skipTurn) {
          setTimeout(() => {
            this.$parent.skipTurn = false;
            this.$emit('next');
          }, this.$parent.botSpeed);
          return;
        }

        this.playAI();
      }
    },
  },
};
</script>

<style scoped>
.player__card--container {
  position: fixed;
  top: 0;

  display: flex;
  justify-content: center;

  margin: 0 auto;

  text-align: center;
}

/* player card */
.player__card {
  margin: calc(var(--base-side) / 10);
}

.player__card--top {
  height: calc(var(--base-side) * 1.5);
  width: var(--base-side);
}

.player__card--side {
  height: var(--base-side);
  width: calc(var(--base-side) * 1.5);
}

.player__info {
  height: calc(var(--base-side) * 1.5);
  width: var(--base-side);
}

.player__card.raised {
  transform: translateY(1rem);
}

.player__info {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  color: dimgray;

  margin: calc(var(--base-side) / 10);
  /* border: 1px solid black; */
  padding-top: calc(var(--base-side) / 5);
  /* TODO on sides when drawed margin is wrong */
}

.player__info--top {
  height: calc(var(--base-side) * 1.5);
  width: auto;
}

.player__info--side {
  height: var(--base-side);
  width: auto;
  /* width: calc(var(--base-side) * 1.5); */
}

.player__stats {
  /* position: absolute; */

  /* margin: auto;
  top: 10%;
  bottom: 0;
  left: 0;
  right: 0; */
  line-height: normal;

  font-size: var(--font-size);
  font-weight: 700;
  text-align: center;
}
.player__name {
  /* align-self: flex-end; */
  /* position: absolute;
  bottom: 3%;
  left: 0;
  right: 0; */

  /* width: auto; */
  line-height: normal;

  font-size: calc(var(--font-size) * 0.6); /*1.1rem;*/
  font-weight: 750;
}

/* Extra small devices (phones, 600px and down) */
@media screen and (max-width: 600px) {
  .player__card {
    display: none;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  /* TODO!!! implement */
    /* * {
    --base-side: 20px;
    --font-size: 1.2rem;
  } */
  /* .player__card {
    display: none;
  } */
}

/* Medium devices (landscape tablets, 768px and up) (iPad portrait && iPhone 11 landscape) */
@media only screen and (min-width: 768px) {
  * {
    --base-side: 20px;
    --font-size: 1.1rem;
  }
  .player__name {
    margin-bottom: 5px;
  }
  /* .player__info {
    flex-direction: row;
    justify-content: space-evenly;
  } */

  /* .player__name {
    font-size: calc(var(--font-size) * 0.8);
  } */
}

/* Large devices (laptops/desktops, 992px and up) */
/* DONE */
@media only screen and (min-width: 992px) {
  * {
    --base-side: 25px;
    --font-size: 1.4rem;
  }

  .player__name {
    margin-bottom: 8px;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  * {
    --base-side: 35px;
    --font-size: 1.8rem;
  }

  .player__name {
    margin-bottom: 8px;
  }
}
</style>
