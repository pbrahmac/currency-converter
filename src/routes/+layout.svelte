<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import { ModeWatcher, mode } from "mode-watcher";
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <meta name="theme-color" content={$mode === "dark" ? "#0a0a0a" : "#ffffff"} />
</svelte:head>

<ModeWatcher />
<Navbar />
{@render children()}
