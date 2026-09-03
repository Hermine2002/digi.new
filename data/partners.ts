import { vendors } from "./vendors";


const strategicPartners = [
  "Oracle",
  "Huawei",
  "Cisco",
  "Dell",
  "VMware",
  "Microsoft",
  "Nvidia",
  "Fortinet",
  
];


export const partners = vendors.filter(
(v)=> strategicPartners.includes(v.name)
);