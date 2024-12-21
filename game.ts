
enum HeroType {
    Warrior = "WARRIOR",
    Mage = "MAGE",
    Archer = "ARCHER"
}


enum AttackType {
    Physical = "PHYSICAL",
    Magical = "MAGICAL",
    Ranged = "RANGED"
}


interface HeroStats {
    health: number;
    attack: number;
    defense: number;
    speed: number;
}


interface Hero {
    id: number;
    name: string;
    type: HeroType;
    attackType: AttackType;
    stats: HeroStats;
    isAlive: boolean;
}


type AttackResult = {
    damage: number;
    isCritical: boolean;
    remainingHealth: number;
}

let heroIdCounter = 1;


function createHero(name: string, type: HeroType): Hero {
    const baseStats: Record<HeroType, HeroStats> = {
        [HeroType.Warrior]: { health: 120, attack: 15, defense: 10, speed: 8 },
        [HeroType.Mage]: { health: 80, attack: 25, defense: 5, speed: 12 },
        [HeroType.Archer]: { health: 100, attack: 18, defense: 8, speed: 15 },
    };

    const attackType: Record<HeroType, AttackType> = {
        [HeroType.Warrior]: AttackType.Physical,
        [HeroType.Mage]: AttackType.Magical,
        [HeroType.Archer]: AttackType.Ranged,
    };

    return {
        id: heroIdCounter++,
        name,
        type,
        attackType: attackType[type],
        stats: baseStats[type],
        isAlive: true,
    };
}


function calculateDamage(attacker: Hero, defender: Hero): AttackResult {
    const baseDamage = attacker.stats.attack - defender.stats.defense;
    const isCritical = Math.random() < 0.2;
    const damage = Math.max(baseDamage, 0) * (isCritical ? 2 : 1);

    defender.stats.health -= damage;
    defender.isAlive = defender.stats.health > 0;

    return {
        damage,
        isCritical,
        remainingHealth: Math.max(defender.stats.health, 0),
    };
}


function findHeroByProperty<T extends keyof Hero>(
    heroes: Hero[],
    property: T,
    value: Hero[T]
): Hero | undefined {
    return heroes.find(hero => hero[property] === value);
}


function battleRound(hero1: Hero, hero2: Hero): string {
    if (!hero1.isAlive || !hero2.isAlive) {
        return `Один із героїв мертвий. Бій не може продовжуватися.`;
    }

    const result1 = calculateDamage(hero1, hero2);
    let log = `${hero1.name} атакує ${hero2.name}, завдаючи ${result1.damage} пошкоджень.`;

    if (!hero2.isAlive) {
        return log + ` ${hero2.name} загинув.`;
    }

    const result2 = calculateDamage(hero2, hero1);
    log += `\n${hero2.name} атакує у відповідь ${hero1.name}, завдаючи ${result2.damage} пошкоджень.`;

    if (!hero1.isAlive) {
        log += ` ${hero1.name} загинув.`;
    }

    return log;
}


const heroes: Hero[] = [
    createHero("Дмитро", HeroType.Warrior),
    createHero("Мерлін", HeroType.Mage),
    createHero("Леголас", HeroType.Archer),
];


console.log("Герої:", heroes);

const warrior = heroes[0];
const mage = heroes[1];
const archer = heroes[2];


console.log(battleRound(warrior, mage));
console.log(battleRound(warrior, archer));


const foundHero = findHeroByProperty(heroes, "type", HeroType.Warrior);
console.log("Знайдений герой:", foundHero);
