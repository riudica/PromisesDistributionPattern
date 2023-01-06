import { SupervisorCache } from "./SupervisorCache";
import { SupervisorService } from "./SupervisorService";

const supervisorCache = new SupervisorCache(new SupervisorService());

export default supervisorCache;
