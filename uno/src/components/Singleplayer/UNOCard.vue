<template>
  <!-- normal card -->
  <b-card
    v-if="type === 'card'"
    class="card__main"
    :bg-variant="card.color"
    text-variant="white"
    :id="card.id"
  >
    <div class="card__value">

      <!-- skip -->
      <b-icon
        v-if="card.value === 'skip'" class="card__skip"
        icon="slash-circle"  scale="1.2"
      />

      <!-- reverse -->
      <b-icon
        v-else-if="card.value === 'reverse'"
        :animation="spinReverse ? 'spin' : ''"
        class="card__reverse"
        icon="arrow-repeat"  scale="1.2"
      />

      <!-- wild -->
      <b-iconstack
        v-else-if="card.value === 'wild'" class="card__wild"
        scale="2"  rotate="45"
      >
          <b-icon
            stacked :variant="card.variant || 'danger'" icon="square-fill"
            scale="0.3" shift-v="3" shift-h="-3"
          />
          <b-icon
            stacked :variant="card.variant || 'success'" icon="square-fill"
            scale="0.3" shift-v="3" shift-h="3"
          />
          <b-icon
            stacked :variant="card.variant || 'warning'" icon="square-fill"
            scale="0.3" shift-v="-3" shift-h="3"
          />
          <b-icon
            stacked :variant="card.variant || 'primary'" icon="square-fill"
            scale="0.3" shift-v="-3" shift-h="-3"
          />
      </b-iconstack>

      <!-- +4 -->
      <div
        v-else-if="card.value === '+4'"
        class="card__p4--container"
      >
        <b-iconstack
          class="card__p4--icon"
          scale="2"  rotate="45"
        >
          <b-icon
            stacked :variant="card.variant || 'danger'" icon="square-fill"
            scale="0.3" shift-v="3.2" shift-h="-3.2"
          />
          <b-icon
            stacked :variant="card.variant || 'success'" icon="square-fill"
            scale="0.3" shift-v="3.2" shift-h="3.2"
          />
          <b-icon
            stacked :variant="card.variant || 'warning'" icon="square-fill"
            scale="0.3" shift-v="-3.2" shift-h="3.2"
          />
          <b-icon
            stacked :variant="card.variant || 'primary'" icon="square-fill"
            scale="0.3" shift-v="-3.2" shift-h="-3.2"
          />
        </b-iconstack>
        <span class="card__p4--text">+4</span>
      </div>

      <!-- numbers -->
      <span v-else>{{ card.value }}</span>

    </div>
  </b-card>

  <!-- deck -->
  <b-card
    v-else-if="type === 'deck'"
    class="card__main deck__main" bg-variant="dark" text-variant="white"
  >
    <div class="card__value deck__value">
      <b-iconstack
        scale="2"  rotate="45"
      >
        <b-icon
          stacked variant="danger" icon="square-fill"
          scale="0.3" shift-v="3.2" shift-h="-3.2"
        />
        <b-icon
          stacked variant="success" icon="square-fill"
          scale="0.3" shift-v="3.2" shift-h="3.2"
        />
        <b-icon
          stacked variant="warning" icon="square-fill"
          scale="0.3" shift-v="-3.2" shift-h="3.2"
        />
        <b-icon
          stacked variant="primary" icon="square-fill"
          scale="0.3" shift-v="-3.2" shift-h="-3.2"
        />
      </b-iconstack>
      <span class="deck__text">UNO</span>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'UNOCard',

  props: {
    card: {
      type: Object,
      required: false,
    },
    type: {
      type: String,
      default: 'card',
      required: false,
    },
    spinReverse: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
};
</script>

<style scoped>
.card__main {
  position: relative;

  height: calc(var(--width) * 1.4);
  width: var(--width);

  margin: 20px var(--margin);

  /* reset bootsrtap style */
  word-wrap: normal;

  transition: .2s;

  cursor: pointer;
}

.card-body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card__value {
  /* margin-top: 2vh; */

  font-size: var(--font-size);
  font-weight: 600;
  text-align: center;

  user-select: none;
}
.card__p4--text {
  position: absolute;
  left: 0;
  right: 0
}
/* deck */
.deck__main {
  cursor: pointer;

  transition: .2s;
}
.deck__main:hover {
  transform: translateY(-.3rem);
}
.deck__value {
  display: flex;
  justify-content: center;
  align-items: center;
}
.deck__text {
  position: absolute;

  font-size: calc(var(--font-size) * 0.9);
  font-weight: 700;
}

/* Extra small devices (phones, 600px and down) */
@media screen and (max-width: 600px) {
  .card__main {
    --width: 40px;
    --font-size: 1rem;
    --margin: 2px;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .card__main {
    --width: 45px;
    --font-size: 1.3rem;
    --margin: 3px;
  }
}

/* Medium devices (landscape tablets, 768px and up)  (iPad portrait && iPhone 11 landscape) */
@media only screen and (min-width: 768px) {
  .card__main {
    --width: 50px;
    --font-size: 1.4rem;
    --margin: 5px;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .card__main {
    --width: 70px;
    --font-size: 2rem;
    --margin: 5px;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .card__main {
    --width: 85px;
    --font-size: 2.5rem;
    --margin: 5px;
  }
}
</style>
