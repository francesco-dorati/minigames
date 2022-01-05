<template>
  <div class="hand__container">
    <div
      v-if="isUserTurn && $parent.skipTurn && $parent.$refs.center.piletop.value === '+4'"
      class="hand__action"
    >
      <span class="hand__action--text">+4</span>
      <b-card
        v-for="number in 4"
        :key="number"
        class="hand__action--card"
        bg-variant="secondary"
      />

    </div>
    <div
      v-else-if="isUserTurn && $parent.skipTurn && $parent.$refs.center.piletop.value === '+2'"
      class="hand__action"
    >
      <span class="hand__action--text">+2</span>
      <b-card
        v-for="number in 2"
        :key="number"
        class="hand__action--card"
        bg-variant="secondary"
      />
    </div>
    <div
      v-else-if="isUserTurn && $parent.skipTurn"
      class="hand__action"
    >
      <b-icon icon="slash-circle" scale="1"/>
      <span class="ml-2">Skipped</span>
    </div>

    <div v-if="user.hand.length === 0" class="emoji--won">🎉</div>

    <UNOCard
      v-for="card in user.hand"
      :key="card.id"
      :class="`
        hand__card
        ${raisedClass(card)}
        ${popoverColorTarget === card.id ? 'choosingColor' : ''}
      `"
      :card="card"
      @click.native="isUserTurn && isPlayable(card) ? play(card) : null"
    />

    <!-- on draw -->
    <b-popover
      v-if="drawed && drawed.id != -1" placement="top"
      ref="drawed" :target="drawed ? drawed.id.toString() : '-1'"
      :title="isPlayable(drawed) ? 'This card is playable' : 'This card is not playable'"
      disabled show
    >
      <!-- if is playable -->
      <div v-if="isPlayable(drawed)">
        <b-button class="mx-1 my-2" variant="success" @click="play(drawed)">
          <b-icon icon="play-fill"/>
          Play
        </b-button>
        <b-button class="mx-1 my-2" variant="danger" @click="keep">
          <b-icon icon="arrow-down-short"/>
          Keep
        </b-button>
      </div>

      <!-- if not playable -->
      <div v-else>
        <b-button class="mx-auto my-2" variant="danger" block @click="keep">
          <b-icon icon="arrow-down-short"/>
          Keep
        </b-button>
      </div>
    </b-popover>

    <!-- on choosing color -->
    <b-popover
      v-if="popoverColorTarget"
      placement="top" ref="chooseColor"
      :target="popoverColorTarget.toString()"
      title="Choose a color"
      show
    >
      <b-icon
        class="mx-2"
        variant="danger" icon="square-fill"
        scale="1.5" shif-v="3" shif-h="-3"
        @click="popoverSetColor('danger')"
      />
      <b-icon
        class="mx-2"
        variant="success" icon="square-fill"
        scale="1.5" shif-v="3" shif-h="3"
        @click="popoverSetColor('success')"
      />
      <b-icon
        class="mx-2"
        variant="warning" icon="square-fill"
        scale="1.5" shif-v="-3" shif-h="3"
        @click="popoverSetColor('warning')"
      />
      <b-icon
        class="mx-2"
        variant="primary" icon="square-fill"
        scale="1.5" shif-v="-3" shif-h="-3"
        @click="popoverSetColor('primary')"
      />
    </b-popover>

  </div>
</template>

<script>
// TODO if card is not playable click it to keep
import UNOCard from './UNOCard.vue';

export default {
  name: 'User',

  components: {
    UNOCard,
  },

  props: {
    isUserTurn: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      user: {
        index: 0,
        name: 'You',
        hand: this.$parent.$refs.center.draw(7).sort(this.$parent.sortHandler),
      },
      popoverColorTarget: null, // target of the choose color popover
      drawed: null, // drawed card
      raised: [], // TO REFACTOR
    };
  },

  methods: {
    isPlayable(card) {
      const isBlack = card.color === 'dark';
      const hasSameColor = card.color === this.$parent.$refs.center.piletop.color;
      const hasSameValue = card.value === this.$parent.$refs.center.piletop.value;
      const hasSameVariant = card.color === this.$parent.$refs.center.piletop.variant;

      return isBlack || hasSameColor || hasSameValue || hasSameVariant;
    },

    draw() {
      // if he can draw
      if (this.canDraw) {
        // draw one
        const drawed = this.$parent.$refs.center.draw();

        // push one to user
        this.user.hand.push(drawed);
        this.user.hand.sort(this.$parent.sortHandler);

        // set the drawed card
        this.drawed = drawed;
      }
    },

    play(card) {
      if (this.popoverColorTarget) { // if choose color popover is open close it
        this.popoverColorTarget = null;
      } else if (card.color === 'dark') { // if the card color is dark open/cloe the popover
        if (this.$refs.drawed) this.$refs.drawed.$emit('close');
        this.popoverColorTarget = card.id;
      } else { // else play it
        this.drawed = null;
        this.$emit('play', card);
      }
    },

    keep() {
      this.drawed = null;
      this.$emit('next');
    },

    popoverSetColor(color) {
      /* eslint-disable no-param-reassign */
      let playedCard;
      this.user.hand.forEach((card) => {
        if (card.id === this.popoverColorTarget) {
          card.variant = color;
          playedCard = card;
        }
        return card;
      });
      this.popoverColorTarget = null;
      this.$emit('play', playedCard);
      /* eslint-disable no-param-reassign */
    },

    raisedClass(card) {
      // here get the index of drawed cardr4
      const cardIsPlayable = !this.$parent.skipTurn
      && this.$parent.showPlayable
      && (this.isUserTurn && (this.isPlayable(card) || card === this.drawed))
      && (this.$parent.$refs.center && !this.$parent.$refs.center.spinReverse);

      // sort and then raise drawed cards
      const wasDrawed = (this.isUserTurn && this.$parent.skipTurn && this.raised.includes(card));

      return cardIsPlayable || wasDrawed
        ? 'raised'
        : '';
    },

  },

  computed: {
    hasPlayableCards() {
      return this.user.hand
        .reduce((result, card) => result || this.isPlayable(card), false);
    },

    canDraw() {
      return !this.$parent.skipTurn
      && this.isUserTurn
      && !this.drawed
      && !this.hasPlayableCards
      && !this.$parent.$refs.center.spinReverse
      && !this.$parent.winner;
    },
  },

  watch: {
    isUserTurn(val) {
      if (val) {
        if (this.$parent.skipTurn) {
          // this.$parent.showPlayable = false;
          // this.isUserTurn = false;

          setTimeout(() => {
            this.$parent.skipTurn = false;
            // this.isUserTurn = true;
            this.$emit('next');
            // this.$parent.showPlayable = true;
            // this.canDraw = false;
          }, this.$parent.botSpeed);
        }
      }
    },

    canDraw(val) {
      this.$parent.$refs.center.$refs.tooltip.$emit(val ? 'open' : 'close');
    },
  },
};
</script>

<style>
.popover-header {
  text-align: center;
}
</style>

<style scoped>
.hand__container {
  display: flex;
  justify-content: center;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  margin: 0 auto;
}

.hand__action {
  position: absolute;

  display: inline;

  font-weight: 700;
  color: dimgrey;
}

.hand__action--text {
  margin-right: 5px;
  line-height: normal;
}

.hand__action--card {
  display: inline-block;

  height: calc(var(--width) * 1.5);
  width: var(--width);

  vertical-align: middle;
}

.hand__card.raised {
  transform: translateY(-2rem);
}
.hand__card:hover {
  transform: translateY(-.3rem);
}

.hand__card.raised:hover,
.hand__card.raised.choosingColor {
  transform: translateY(-2.3rem) !important;
}

.popover {
  margin-bottom: 15px;
}

.popover svg {
  cursor: pointer;
}

.emoji--won {
  margin-bottom: 20px;
  font-size: 3rem;
}

@media screen and (max-width: 600px) {
  .hand__action {
    --width: 15px;

    top: -80%;
    left: auto;

    font-size: 1.5rem;
  }

  .hand__action--card {
    margin: 0 2px 5px 2px;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .hand__action {
    --width: 15px;

    top: -100%;
    left: 61.5%;

    font-size: 1.5rem;
  }

  .hand__action--card {
    margin: 0 2px 5px 2px;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .hand__action {
    --width: 25px;

    top: -80%;
    left: auto;

    font-size: 2.5rem;
  }

  .hand__action--card {
    margin: 0 3.75px 5px 3.75px;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .hand__action {
    --width: 25px;

    top: -80%;
    left: auto;

    font-size: 2.5rem;
  }

  .hand__action--card {
    margin: 0 3.75px 5px 3.75px;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .hand__action {
    --width: 25px;

    top: -80%;
    left: auto;

    font-size: 2.5rem;
  }

  .hand__action--card {
    margin: 0 3.75px 5px 3.75px;
  }
}
</style>
