export type Pri = "critical" | "high" | "routine";
export type Answer = "pass" | "fail" | "na";
export interface CheckItem { id: string; label: string; hint: string; pri: Pri }
export interface CheckSection { id: string; title: string; providerId: string; items: CheckItem[] }

const it = (id: string, label: string, hint: string, pri: Pri): CheckItem => ({ id, label, hint, pri });

/** The 45-item station inspection checklist (6 sections). Items marked "added" were not visible in the reference screenshots and follow the same pattern. */
export const CHECK_SECTIONS: CheckSection[] = [
  { id: "elevators", title: "Elevators", providerId: "elv", items: [
    it("el1", "Elevator operational", "Doors open/close, car moves between floors", "critical"),
    it("el2", "Interior lighting functional", "All interior lights working properly", "high"),
    it("el3", "Emergency phone/intercom working", "Emergency call button connects to dispatch", "critical"),
    it("el4", "Certificate posted & current", "Inspection certificate visible and not expired", "high"),
    it("el5", "Interior cleanliness", "No debris, graffiti, or biohazard material present", "routine"),
    it("el6", "Floor indicators working", "Digital/mechanical floor display functioning", "routine"),
    it("el7", "Door sensors functional", "Safety sensors prevent door close on obstruction", "critical") ] },
  { id: "cameras", title: "Security Cameras", providerId: "cam", items: [
    it("cm1", "All cameras online", "No offline or degraded feeds in station area", "critical"),
    it("cm2", "Camera lenses clean", "No obstructions, fog, or graffiti on lens", "high"),
    it("cm3", "Platform coverage complete", "Full platform visible, no blind spots", "critical"),
    it("cm4", "Stairwell cameras operational", "Feeds from stairwells and entrances are live", "high"),
    it("cm5", "Recording system active", "Footage is being recorded and retained (added)", "critical"),
    it("cm6", "Camera housings intact", "No damaged or loose housings or mounts (added)", "routine"),
    it("cm7", "Camera clocks correct", "Timestamps match station time (added)", "routine") ] },
  { id: "stairwells", title: "Stairwells", providerId: "dart-fac", items: [
    it("st1", "Handrails secure", "Both rails firmly mounted, no wobble", "critical"),
    it("st2", "Lighting adequate", "All stairwell lights functional, no dark areas", "high"),
    it("st3", "Steps free of debris", "No litter, standing water, or slip hazards on steps", "high"),
    it("st4", "Graffiti absent", "No graffiti or vandalism on walls or handrails", "routine"),
    it("st5", "Non-slip surfaces intact", "Anti-slip tape or treads intact and not peeling", "high"),
    it("st6", "Emergency lighting functional", "Backup lighting activates on power loss", "critical"),
    it("st7", "Drainage clear", "Floor drains not clogged; no pooling water", "routine") ] },
  { id: "trash", title: "Trash Cans & Waste Stations", providerId: "cln-a", items: [
    it("tr1", "All receptacles in place", "No missing or overturned waste bins", "routine"),
    it("tr2", "Receptacles not overflowing", "Less than 75% full; no overflow onto platform", "high"),
    it("tr3", "Recycling bins labeled", "Recycling bins clearly labeled and separate from trash", "routine"),
    it("tr4", "No biohazard material", "No syringes, blood, or medical waste present", "critical"),
    it("tr5", "Lids/covers intact", "Bin lids functional and properly covering contents", "routine"),
    it("tr6", "Surrounding area clean", "No litter around bins (added)", "routine") ] },
  { id: "shelters", title: "Bus Covers & Shelters", providerId: "dart-fac", items: [
    it("sh1", "Roof/canopy structurally sound", "No sagging, cracks, or loose panels", "critical"),
    it("sh2", "Seating clean and intact", "No broken, vandalized, or missing bench sections", "routine"),
    it("sh3", "Lighting operational", "All shelter lights working", "high"),
    it("sh4", "Schedule/route info posted", "Current schedule and route maps displayed", "routine"),
    it("sh5", "No graffiti or vandalism", "Panels, glass, and seating free of graffiti", "routine"),
    it("sh6", "Drainage functional", "No water pooling under or around shelter", "routine"),
    it("sh7", "Glass panels intact", "No cracked, broken, or missing glass panels", "high"),
    it("sh8", "ADA accessibility clear", "Curb cut and ramp to shelter unobstructed", "critical") ] },
  { id: "general", title: "General Station Condition", providerId: "cln-a", items: [
    it("ge1", "Platform clear of obstructions", "Full-length platform accessible, no blocked sections", "critical"),
    it("ge2", "Signage visible and current", "All directional and safety signs legible and current", "high"),
    it("ge3", "PA system functional", "Announcements audible across platform length", "high"),
    it("ge4", "Ticket machines operational", "All vending/validator machines online and accepting payment", "high"),
    it("ge5", "Restrooms clean and stocked", "Soap, paper, flushing all functional; no biohazard", "high"),
    it("ge6", "No water intrusion", "No leaks, water stains on ceiling or walls", "high"),
    it("ge7", "Platform edge markings visible", "Yellow tactile strip and edge line clear and unpeeled", "critical"),
    it("ge8", "Emergency exits unlocked", "All emergency exit doors operable and unobstructed", "critical"),
    it("ge9", "Fire extinguishers present", "Extinguishers in place, pressure in green zone, tagged current", "critical"),
    it("ge10", "Overall cleanliness acceptable", "Platform, walls, and ceilings meet cleanliness standard", "routine") ] },
];
export const ALL_ITEMS = CHECK_SECTIONS.flatMap((s) => s.items.map((i) => ({ ...i, sectionId: s.id })));
export const TOTAL_ITEMS = ALL_ITEMS.length; // 45
/** The inspection can be submitted once 80% of items are answered. */
export const MIN_ANSWERED = Math.ceil(TOTAL_ITEMS * 0.8); // 36
