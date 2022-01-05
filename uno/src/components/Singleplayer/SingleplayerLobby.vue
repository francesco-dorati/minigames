<template>
  <div class="singleplayer__options">
    <br/>

    <h1>Singleplayer</h1>

    <br/>
    <br/>

    <!-- player list -->
    <b-list-group class="lobby__players">
      <b-list-group-item class="lobby__players--item">
        <b>You</b>
        <b-badge variant="secondary" pill>
          Host
        </b-badge>
      </b-list-group-item>

      <b-list-group-item
        v-for="(bot, index) in bots"
        class="lobby__players--item"
        :key="index"
      >
        <b>Bot {{ index + 1 }}</b>
      </b-list-group-item>
    </b-list-group>

    <br/>
    <br/>

    <!-- bots -->
    <b-card-group class="lobby__info">
      <b-card header="Bots">
        <b-form-spinbutton
          v-model="bots"
          min="1"
          max="3"
          inline
        />
      </b-card>
      <b-card header="Difficulty">
        <b-form-spinbutton
          v-model="difficulty.value"
          :formatter-fn="(value) => difficulty.types[value]"
          min="0"
          max="2"
          inline
        />
      </b-card>
    </b-card-group>

    <br/>
    <br/>

    <!-- settings -->
    <b-card header="Settings" class="lobby__settings">
      <div>
        <div class="settings__title">
          <b><i>Gameplay</i></b>
        </div>
        <b-form-checkbox
          id="show-playable"
          v-model="showPlayable" switch
        >
          Show playable cards
        </b-form-checkbox>
        <!-- TODO implement -->
        <b-form-checkbox
          id="show-tooltip"
          v-model="showTooltip" switch
        >
          Show tooltip on drawed card
        </b-form-checkbox>
        <b-form-checkbox
          id="sort-hand"
          v-model="sortHand" switch
        >
          Sort hand cards
        </b-form-checkbox>
      </div>
      <br/>
      <div>
        <div class="settings__title">
          <b><i>Bots</i></b>
        </div>

        <label for="bot-speed">Bot Speed:</label>
        <b-form-spinbutton
          v-model="botSpeed"
          class="ml5"
          id="bot-speed"
          :formatter-fn="(val) => `${val / 1000} s`"
          min="0"
          max="10000"
          step="500"
        />
      </div>
    </b-card>

    <br/>
    <br/>

    <b-button
      class="mr-3"
      @click="back"
    >
      <b-icon icon="arrow-left" class="mr-1"></b-icon>
      Back
    </b-button>

    <b-button
      variant="success"
      @click="start"
    >
      <b-icon icon="play-fill" class="mr-1"></b-icon>
      Start
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'SingleplayerLobby',

  data() {
    return {
      bots: 1,
      difficulty: {
        value: 1,
        types: ['Easy', 'Medium', 'Hard'],
      },
      botSpeed: 1500,
      showPlayable: true,
      showTooltip: true,
      sortHand: true,
    };
  },

  methods: {
    back() {
      this.$router.push('/');
    },

    start() {
      this.$emit('start', {
        playersNumber: this.bots + 1,
        difficultyId: this.difficulty.value,
        botSpeed: this.botSpeed,
        showPlayable: this.showPlayable,
      });
    },
  },

};
</script>

<style>
.singleplayer__options {
  text-align: center;
}

.lobby__players {
  width: 450px;
  margin: auto;
  text-align:left;
}

.lobby__info {
  width: 450px;
  margin: auto;
}

.lobby__settings {
  width: 450px;
  margin: auto;
}

.lobby__settings .card-body {
  text-align: left;
}

.settings__title {
  text-align: left;
  /* margin-bottom: 3px; */
}

.lobby__players--item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
