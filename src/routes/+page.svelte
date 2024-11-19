<script>
  import { Button } from "$lib/components/ui/button/index";
  import * as Card from "$lib/components/ui/card/index";
  import { Separator } from "$lib/components/ui/separator/index";
  import Coins from "lucide-svelte/icons/coins";
  import Swap from "lucide-svelte/icons/arrow-left-right";
  import { Input } from "$lib/components/ui/input/index";
  import { Label } from "$lib/components/ui/label/index";
  import { getEmoji } from "$lib/utils";

  let convertFrom = $state("JPY");
  let convertTo = $state("USD");
</script>

<svelte:head>
  <title>Currency Converter - Quid</title>
</svelte:head>

<div class="p-4 mt-20 flex flex-col items-center text-foreground/90">
  <div class="w-full max-w-screen-md py-4 flex flex-col items-center space-y-8">
    <h1 class="font-medium text-xl">Your all-in-one currency converter.</h1>
    <Card.Root class="md:w-[400px] w-full">
      <Card.Header>
        <div class="flex justify-between w-full">
          <div class="flex flex-col space-y-1 justify-center w-auto">
            <Card.Title>Currency Converter</Card.Title>
            <Card.Description class="text-xs">
              Convert {convertFrom} to {convertTo}
            </Card.Description>
          </div>
          <Button variant="ghost" size="icon">
            <Swap class="size-10" />
          </Button>
        </div>
      </Card.Header>
      <Card.Content class="flex items-center justify-center w-full space-x-4">
        <div class="flex flex-col justify-center space-y-2">
          <Label for="convertFrom">{getEmoji(convertFrom)} {convertFrom}</Label>
          <Input name="convertFrom" type="number" pattern="[0-9]*" />
        </div>
        <div class="flex flex-col justify-center space-y-2">
          <Label for="convertTo">{getEmoji(convertTo)} {convertTo}</Label>
          <Input name="convertTo" type="number" pattern="[0-9]*" />
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
            <p class="text-sm">1 {convertFrom} = 0.0065 {convertTo}</p>
            <p class="text-xs text-muted-foreground">
              Updated 11/19/2024, 2:59:12 AM
            </p>
          </div>
        </div>
      </Card.Footer>
    </Card.Root>
  </div>
</div>
