import {
  BaseSource,
  Item,
} from "https://deno.land/x/ddc_vim@v2.2.0/types.ts";
import {
  GatherArguments,
} from "https://deno.land/x/ddc_vim@v2.2.0/base/source.ts";
import { Denops, vars } from "https://deno.land/x/ddc_vim@v2.2.0/deps.ts";

type Params = Record<never, never>;

export type Snippets = {
  [word: string]: {
    location: string;
    description: string;
  };
};


export class Source extends BaseSource<Params> {
  private previousLhs = "";
  private previousPartial = "";
  async gather(
    args: GatherArguments<Params>,
  ): Promise<Item[]> {
      const currentInput = args.context.input;

      const [lhs, partial] = this.parseInput(currentInput);

      if (!lhs) {
            // return null
            return Object.keys({trigger: ""}).map((trigger) => ({
              word: trigger,
              menu: "DIDNT SUCCESS",
              user_data: "NO USER DATA",
            }));
        }

      if (lhs != this.previousLhs || partial?.startsWith(this.previousPartial))
      {
            this.previousLhs = lhs!
            this.previousPartial = partial!
            args.denops.call(
              "deoplete#source#omnisharp#sendRequest",
              lhs,
              partial
            );
            return [];
      }

        const info = await vars.g.get(
          args.denops,
          "deoplete#source#omnisharp#_results",
        ) as Snippets;
        return Object.keys(info).map((trigger) => ({
          word: trigger,
        }));
  }

  private parseInput(
    input: string,
  ): [string | undefined, string | undefined] {
        const match = input.match(/^(?<firstgroup>.*\W)(?<secondgroup>\w*)$/);

        if (match !== null) {
            return [match?.groups?.firstgroup, match?.groups?.secondgroup];
        }        
        return ["Match was null", "Match was null"];
    }


  params(): Params {
    return {
      kindLabels: {},
    };
  }
}

