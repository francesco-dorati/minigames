<template>
  <div class="home">

    <div class="main">
      <b-button
        class="button button--singleplayer"
        size="lg"
        block
        @click="$router.push('singleplayer')"
      >
        <span>Singleplayer</span>
      </b-button>

      <b-button
        class="button button--multiplayer"
        size="lg"
        block
        @click="$router.push('multiplayer')"
      >
        <span>Multiplayer</span>
      </b-button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style>
.home {
  height: 100vh;
  width: 100vw;
}

.main {
  width: 500px;
  margin: 100px auto;
}

.button {
  margin: 30px 0;
}
</style>
