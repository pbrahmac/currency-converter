<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card/index";
  import { Input } from "$lib/components/ui/input/index";
  import { Label } from "$lib/components/ui/label/index";
  import { Separator } from "$lib/components/ui/separator/index";
  import type { Country } from "$lib/utils";
  import Swap from "lucide-svelte/icons/arrow-left-right";
  import Coins from "lucide-svelte/icons/coins";
  import CountryPicker from "./CountryPicker.svelte";

  let convertFromCurrency: Country = $state("USD");
  let convertToCurrency: Country = $state("THB");

  let convertFromAmount: string = $state("0");
  let convertToAmount: string = $state("0");

  function fakeConvertSecondFromFirst(value: string) {
    const conversionRate: number = 3;

    const first = parseFloat(value);
    const convertedSecond = first * conversionRate;
    convertToAmount = convertedSecond === 0 ? "0" : convertedSecond.toFixed(2);
    return convertToAmount;
  }

  function fakeConvertFirstFromSecond(value: string) {
    const conversionRate: number = 1 / 3;

    const second = parseFloat(value);
    const convertedFirst = second * conversionRate;
    convertFromAmount = convertedFirst === 0 ? "0" : convertedFirst.toFixed(2);
    return convertFromAmount;
  }

  function staticConvertFirstFromFirst(value: number) {
    const conversionRate = 3;
    const convertedSecond = value * conversionRate;
    return convertedSecond;
  }

  function handleSwap() {
    [convertFromCurrency, convertToCurrency] = [
      convertToCurrency,
      convertFromCurrency,
    ];
    [convertFromAmount, convertToAmount] = [convertToAmount, convertFromAmount];
  }
</script>

<Card.Root class="md:w-[400px] w-full">
  <Card.Header>
    <div class="flex justify-between w-full">
      <div class="flex flex-col space-y-1 justify-center w-auto">
        <Card.Title>Currency Converter</Card.Title>
        <Card.Description class="text-xs">
          Convert {convertFromCurrency} to {convertToCurrency}
        </Card.Description>
      </div>
      <Button variant="ghost" size="icon" onclick={handleSwap}>
        <Swap class="size-10" />
      </Button>
    </div>
  </Card.Header>
  <Card.Content class="flex items-center justify-center w-full space-x-4">
    <div class="flex flex-col justify-center space-y-2">
      <Label for="convertFrom">
        <CountryPicker currCode={convertFromCurrency} direction="from" />
      </Label>
      <Input
        bind:value={convertFromAmount}
        name="convertFrom"
        type="number"
        pattern="[0-9]*"
        oninput={(e) => fakeConvertSecondFromFirst(e.currentTarget.value)}
      />
    </div>
    <div class="flex flex-col justify-center space-y-2">
      <Label for="convertTo">
        <CountryPicker currCode={convertToCurrency} direction="to" />
      </Label>
      <Input
        bind:value={convertToAmount}
        name="convertTo"
        type="number"
        pattern="[0-9]*"
        oninput={(e) => fakeConvertFirstFromSecond(e.currentTarget.value)}
      />
    </div>
  </Card.Content>
  <Card.Footer class="flex flex-col space-y-2">
    <Button class="w-full">Clear</Button>
    <Separator />
    <div
      class="w-full border flex items-center justify-start space-x-4 px-3 py-2 rounded-md"
    >
      <Coins class="size-6 mx-2" />
      <div class="flex flex-col justify-center">
        <p class="text-sm">
          1 {convertFromCurrency} = {staticConvertFirstFromFirst(1).toFixed(4)}
          {convertToCurrency}
        </p>
        <p class="text-xs text-muted-foreground">
          Updated 11/19/2024, 2:59:12 AM
        </p>
      </div>
    </div>
  </Card.Footer>
</Card.Root>
