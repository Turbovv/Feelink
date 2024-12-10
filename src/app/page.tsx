import { HydrateClient } from "~/trpc/server";
import { Posts } from './posts'
export default  function Home() {


  return (
    <HydrateClient>
      <div>
        blanket
        <Posts />
      </div>
    </HydrateClient>
  );
}
