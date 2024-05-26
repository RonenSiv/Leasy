import Cookies from "js-cookie";
import { getClient } from "@/app/model/auth/client.base";

export const getBrowserClient = () => getClient({ cookieStore: Cookies });
