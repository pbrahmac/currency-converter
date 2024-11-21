<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index";
  import Countries from "$lib/util/countries.json";
  import {
    cn,
    fetchConversionData,
    formatCountryName,
    getEmoji,
    type Country,
  } from "$lib/utils";
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import { MediaQuery } from "runed";
  import Skeleton from "../ui/skeleton/skeleton.svelte";

  // types
  type CountriesList = {
    emoji: string;
    code: Country;
    name: string | undefined;
  }[];

  // props
  let {
    direction,
    currCode = $bindable(),
    fromCode,
  }: {
    direction: "from" | "to";
    currCode: Country;
    fromCode: Country;
  } = $props();

  // media query
  const isDesktop = new MediaQuery("(min-width: 768px)");

  // state variables
  let open = $state(false);

  // full and filtered countries lists
  let countriesList: CountriesList = $state(
    Object.entries(Countries)
      .filter((country) =>
        direction === "to" ? country[0] !== fromCode : true
      )
      .map((country) => ({
        emoji: country[1],
        code: country[0] as Country,
        name: undefined,
      }))
  );
  let filteredCountriesList = $state(countriesList);

  // search and select handlers
  let searchValue = $state("");
  function handleSearch() {
    filteredCountriesList = countriesList.filter((country) =>
      Object.values(country)
        .map((field) => field && field.toLowerCase())
        .join(" ")
        .includes(searchValue.toLowerCase())
    );
  }
  function handleSelect(code: Country) {
    currCode = code;
    open = false;
  }

  // on component mount, fetch full country names for search
  $effect(() => {
    // fetch rates data
    fetchConversionData("USD").then((refreshedRates) => {
      // filter out invalid countries in-place
      countriesList.splice(
        0,
        countriesList.length,
        ...countriesList.filter(
          (country) => refreshedRates[country.code.toLowerCase()] !== undefined
        )
      );
      // add formatted name fields to each valid country
      countriesList.forEach((country) => {
        if (country.code === "USD") {
          country.name = "U.S. Dollar";
          return;
        }
        const name = refreshedRates[country.code.toLowerCase()].name;
        country.name = formatCountryName(name);
      });
    });
  });
</script>

{#if isDesktop.matches}
  <Dialog.Root bind:open>
    <Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }), "pr-3")}>
      <div class="flex items-center justify-between space-x-4 w-full">
        <p>{getEmoji(currCode)} {currCode}</p>
        <ChevronsUpDown />
      </div>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Convert {direction} Currency</Dialog.Title>
        <Dialog.Description>
          Select the currency code associated with your currency.
        </Dialog.Description>
      </Dialog.Header>
      <Input bind:value={searchValue} oninput={() => handleSearch()} />
      <ul class="w-full">
        <ScrollArea class="sm:h-96 h-[77svh] w-full">
          <div class="rounded-md border w-full">
            {#each filteredCountriesList as country}
              <button
                class="flex w-full hover:bg-secondary items-center justify-between py-3 px-4 border-b last:border-b-0"
                onclick={() => handleSelect(country.code)}
              >
                <li class="w-full">
                  <div class="flex items-baseline space-x-2">
                    <p>{country.emoji}</p>
                    <p>{country.code}</p>
                    {#if country.name === undefined}
                      <Skeleton class="w-1/2 h-3" />
                    {:else}
                      <span
                        class="text-muted-foreground text-sm text-nowrap max-w-64 text-ellipsis overflow-hidden"
                      >
                        ({country.name})
                      </span>
                    {/if}
                  </div>
                </li>
                {#if country.code === currCode}
                  <Check />
                {/if}
              </button>
            {/each}
          </div>
        </ScrollArea>
      </ul>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root closeThreshold={0.9} bind:open>
    <Drawer.Trigger class={cn(buttonVariants({ variant: "outline" }), "pr-3")}>
      <div class="flex items-center justify-between space-x-4 w-full">
        <p>{getEmoji(currCode)} {currCode}</p>
        <ChevronsUpDown />
      </div>
    </Drawer.Trigger>
    <Drawer.Content class="outline-none p-4 h-[65svh]">
      <Drawer.Header class="text-left">
        <Drawer.Title>Convert {direction} Currency</Drawer.Title>
        <Drawer.Description>
          Select the currency code associated with your currency.
        </Drawer.Description>
      </Drawer.Header>
      <Input
        autofocus={false}
        bind:value={searchValue}
        oninput={() => handleSearch()}
      />
      <ul class="w-full mt-4">
        <ScrollArea class="sm:h-96 h-[40svh] rounded-md border w-full">
          {#each filteredCountriesList as country}
            <button
              class="flex w-full hover:bg-secondary items-center justify-between py-3 px-4 border-b last:border-b-0"
              onclick={() => handleSelect(country.code)}
            >
              <li class="w-full">
                <div class="flex items-baseline space-x-2">
                  <p>{country.emoji}</p>
                  <p>{country.code}</p>
                  {#if country.name === undefined}
                    <Skeleton class="w-1/2 h-3" />
                  {:else}
                    <span
                      class="text-muted-foreground text-sm text-nowrap max-w-64 text-ellipsis overflow-hidden"
                    >
                      ({country.name})
                    </span>
                  {/if}
                </div>
              </li>
              {#if country.code === currCode}
                <Check />
              {/if}
            </button>
          {/each}
        </ScrollArea>
      </ul>
    </Drawer.Content>
  </Drawer.Root>
{/if}
