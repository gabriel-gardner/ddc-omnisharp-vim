import {
  BaseSource,
  Item,
} from "https://deno.land/x/ddc_vim@v2.2.0/types.ts";
import {
  GatherArguments,
} from "https://deno.land/x/ddc_vim@v2.2.0/base/source.ts";

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  private previousLhs: string = "";
  private previousPartial: string = "";
  async gather(
    args: GatherArguments<Params>,
  ): Promise<Item[]> {
      const currentInput = args.context.input;

        
    return Object.keys(["abra", "cadabra"]).map((trigger) => ({
      word: trigger,
      menu: "HI MENU",
      user_data: "NO USER DATA",
    }));


      const [lhs, partial] = this.parseInput(currentInput);

      if (!lhs) {
            // return null
            return [];
        }

      if (lhs != this.previousLhs || partial.startsWith(this.previousPartial))
      {
            this.previousLhs = lhs;
            this.previousPartial = partial;
            const results = await args.denops.call(
              "Omnisharp#actions#complete#Get",
              lhs,
              partial,
            ) as {
              [trigger: string]: string;
            };
            return [];
          //self.previousLhs = lhs
          //self.previousPartial = partial
          //self.vim.call('deoplete#source#omnisharp#sendRequest', lhs, partial)
          //return []
      }
      return [];
  }

  private parseInput(
    input: string,
  ): [string, string] {
        const match = input.match(/r"^(.*\W)(\w*)$"/);

        if (match != null) {
            return [match[0], match[1]];
        }        
        return ["", ""];
    }


  params(): Params {
    return {
      kindLabels: {},
    };
  }
}

