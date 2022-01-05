<template>
  <div class="deck-piletop__container">
    <!-- deck -->
    <UNOCard
      id="deck"
      type="deck"
      @click.native="deckClick()"
    />

    <!-- piletop -->
    <UNOCard
      :key="piletop.id"
      :card="piletop"
      :spinReverse="spinReverse"
    />
    <!-- :class="`piletop bounce`" -->

    <b-tooltip
      ref="tooltip"
      target="deck" triggers="manual" placement="bottom"
      variant="danger"
    >
      <b @click="deckClick()">Draw a card!</b>
    </b-tooltip>
  </div>
</template>

<script>
import UNOCard from './UNOCard.vue';

export default {
  name: 'Center',

  components: {
    UNOCard,
  },

  data() {
    return {
      deck: [],
      piletop: null,

      // animation
      spinReverse: false,
    };
  },

  methods: {
    createDeck() {
      /* eslint-disable no-plusplus */
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      let id = 0;

      // loop for every color
      this.$parent.colors.forEach((color) => {
        // add 0
        this.deck.push({
          id: id++,
          value: '0',
          color,
        });

        // do twice
        [0, 1].forEach(() => {
          // loop for every number
          numbers.forEach((number) => {
            // add each card
            this.deck.push({
              id: id++,
              value: `${number}`,
              color,
            });
          });

          // add special colored cards
          this.deck.push(
            {
              id: id++,
              value: 'reverse',
              color,
            },
            {
              id: id++,
              value: 'skip',
              color,
            },
            {
              id: id++,
              value: '+2',
              color,
            },
          );
        });

        // add black cards
        this.deck.push(
          {
            id: id++,
            value: '+4',
            color: 'dark',
            variant: null,
          },
          {
            id: id++,
            value: 'wild',
            color: 'dark',
            variant: null,
          },
        );
      });
      /* eslint-disable no-plusplus */
    },

    shuffleDeck() {
      const array = [...this.deck];

      let currentIndex = array.length;
      let randomIndex;
      let tmp;

      while (currentIndex !== 0) {
        // pick remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // swap
        tmp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tmp;
      }

      this.deck = [...array];
      // this.deck.sort(() => Math.random() - 0.5);
    },

    setPiletop() {
      this.piletop = this.draw();

      // if piletop's color is dark set the color randomly
      if (this.piletop.color === 'dark') {
        const randomColorIndex = Math.floor(Math.random() * this.$parent.colors.length);
        this.piletop.variant = this.$parent.colors[randomColorIndex];
      }
    },

    draw(n = 1) {
      return n === 1 ? this.deck.splice(0, n)[0] : this.deck.splice(0, n);
    },

    deckClick() {
      this.$parent.$refs.user.draw();
    },
  },

  created() {
    this.createDeck();
    this.shuffleDeck();
    this.setPiletop();
  },
};
</script>

<style scoped>
.deck-piletop__container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
}

.tooltip {
  margin-top: 7.5px;
  z-index: 5;
  cursor: pointer;
  user-select: none;
}
</style>
