<template>
  <SingleplayerLobby
    v-if="status === 'lobby'"
    @start="start"
  />

  <SingleplayerGame
    v-else-if="status === 'playing'"
    :playersNumber="playersNumber"
    :difficultyId="difficultyId"
    :botSpeed="botSpeed"
    :showPlayable="showPlayable"
    @playAgain="playAgain"
    @goLobby="goLobby"
    @goHome="goHome"
  />
</template>

<script>
import SingleplayerLobby from '@/components/Singleplayer/SingleplayerLobby.vue';
import SingleplayerGame from '@/components/Singleplayer/SingleplayerGame.vue';

export default {
  name: 'Singleplayer',

  components: {
    SingleplayerLobby,
    SingleplayerGame,
  },

  data() {
    return {
      status: 'lobby',
      playersNumber: undefined,
      difficultyId: undefined,
      botSpeed: undefined,
      showPlayable: undefined,
    };
  },

  methods: {
    back() {
      this.$router.push('/');
    },

    start(data) {
      this.status = 'playing';
      this.playersNumber = data.playersNumber;
      this.difficultyId = data.difficultyId;
      this.botSpeed = data.botSpeed;
      this.showPlayable = data.showPlayable;
    },

    playAgain() {
      this.status = 'lobby';
      setTimeout(() => { this.status = 'playing'; }, 0);
    },

    goLobby() {
      this.status = 'lobby';
    },

    goHome() {
      this.$router.push('/');
    },
  },

};
</script>
