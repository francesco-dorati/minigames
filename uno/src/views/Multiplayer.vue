<template>
<div class="multiplayer__options" v-if="step === 0">
    <br/>

    <h1>Multiplayer</h1>

    <br/>

    <h4>Name:</h4>
    <b-form-input
      class="input options__name"
      :formatter="(value) => value.toLowerCase()"
    />
    <!-- TODO max 10 chars -->

    <br/>
    <br/>

    <b-card-group
      class="card__group"
      deck
    >
      <b-card
        class="card card--host"
        header="Host"
      >
        <b-card-body>
          <b-button @click="host">
            Create Server
          </b-button>
        </b-card-body>
      </b-card>

      <b-card
        class="card card--enter"
        header="Connect to a game"
      >
        <b-card-body>
          <b-form-input
            class="input options__code--input"
            :formatter="(value) => value.toUpperCase()"
          />
          <b-button
            class="options__code--button"
            @click="connect"
          >
            <!-- Add loading -->
            Go
          </b-button>
        </b-card-body>
      </b-card>

    </b-card-group>

    <br/>
    <br/>

    <b-button
      @click="backToHome"
    >
      Back
    </b-button>

  </div>

  <div class="multiplayer__lobby" v-else-if="step === 1">
    <br/>

    <h1>Multiplayer</h1>

    <br/>

    <h4>Code:</h4>
    <h3><strong>H34DD32</strong></h3>
    <!-- TODO click to copy -->

    <br/>
    <br/>

    <b-list-group class="lobby__players">
      <b-list-group-item
        v-for="player in players"
        class="lobby__players--item"
        :key="player.id"
      >
        <b>{{ player.name }}</b>
        <b-badge
          v-if="hostId === player.id"
          variant="secondary"
          pill
        >
          Host
        </b-badge>
        <b-badge
          v-else-if="player.ready"
          variant="success"
          pill
        >
          Ready
        </b-badge>
        <b-badge
          v-else
          variant="danger"
          pill
        >
          Waiting...
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

    <div v-if="hostId === userId">
      <b-card-group class="lobby__info">
        <b-card header="Bots">
          <b-form-spinbutton
            v-model="bots"
            min="0"
            :max="4 - players.length"
            inline
          />
        </b-card>
        <b-card header="Difficulty">
          <b-form-spinbutton
            v-model="difficulty.value"
            :formatter-fn="(value) => difficulty.types[value]"
            min="0"
            max="2"
            :disabled="bots === 0"
            inline
          />
        </b-card>
      </b-card-group>
    </div>
    <div v-else>
      <b-card-group class="lobby__info">
        <b-card header="Bots">
          <h4>{{ bots }}</h4>
        </b-card>
        <b-card header="Difficulty">
          <h4>{{ bots ? difficulty.types[difficulty.value] : '--' }}</h4>
        </b-card>
      </b-card-group>
    </div>

    <br/>
    <br/>

    <b-button class="mr-3" @click="backToMulti">
      Back
    </b-button>
    <b-button
      v-if="userId === hostId"
      variant="success"
      :disabled="!allReady"
      @click="start"
    >
      Start
    </b-button>
    <b-button
      v-else
      variant="success"
      @click="ready"
    >
      Ready
    </b-button>

  </div>

  <div class="singleplayer__game" v-else>
    <MultiplayerGame
      :players="players"
      :difficulty="difficulty.value"
    />
  </div>
</template>

<script>
export default {
  name: 'Multiplayer',

  data() {
    return {
      step: 0,
      userId: 0,
      hostId: 0,
      players: [
        {
          id: 0,
          name: 'francescodorati',
        },
        {
          id: 1,
          name: 'myname',
          ready: false,
        },
        {
          id: 2,
          name: 'anotherplayer',
          ready: true,
        },
      ],
      bots: 0,
      difficulty: {
        value: 0,
        types: ['Easy', 'Medium', 'Hard'],
      },
    };
  },

  methods: {
    backToHome() {
      this.$router.push('/');
    },

    host() {
      this.step = 1;
    },

    connect() {
      this.step = 1;
    },

    backToMulti() {
      this.step = 0;
    },

    start() {
      //
    },
  },

  computed: {
    allReady() {
      return true; // if all are ready
    },
  },
};
</script>

<style>
.multiplayer__options,
.multiplayer__lobby {
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

.lobby__players--item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lobby__players--host {
  vertical-align: baseline;
  margin-left: 10px
}

.card__group {
  margin: 40px auto 10px auto;
  width: 800px;
}

.input {
  display: inline;
  width: 200px;
  margin: auto;
}

.options__code--button {
  margin: 0 0 5px 10px;
}
</style>
