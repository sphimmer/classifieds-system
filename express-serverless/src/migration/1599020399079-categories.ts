import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { Category } from "../models/entities/Category";
import { CategorySeed } from "../seeds/CategorySeed";
import { AmmoSubcategories } from "../seeds/AmmoSubcategories";
import { AccessoriesSubcategories } from "../seeds/AccessoriesSubcategories";
import { PistolSubcategories } from "../seeds/PistolSubcategories";
import { RifleSubcategories } from "../seeds/RifleSubcategories";
import { ShotgunSubcategories } from "../seeds/ShotgunSubcategories";
import Container from "typedi";
import { CategoryService } from "../services/CategoryService";

export class categories1599020399079 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {


            const repo = getRepository(Category);
            const categoryService = Container.get(CategoryService)
            const categories = await repo.save(CategorySeed);
            categories.map(async category => {
                if (category.name == "Ammo") {

                    const subCats = await repo.save(AmmoSubcategories);
                    category.subcategories = subCats.map(ac => {
                        return ac
                    });
                    category.subcategories = subCats;
                    await categoryService.updateCategory(category.id, { name: category.name, subcategories: category.subcategories });
                }
                if (category.name == "Accessories") {
                    const subCats = await repo.save(AccessoriesSubcategories);
                    category.subcategories = subCats.map(ac => {
                        return ac
                    })
                    category.subcategories = subCats;
                    await categoryService.updateCategory(category.id, { name: category.name, subcategories: category.subcategories });
                }
                if (category.name == "Pistols") {
                    const subCats = await repo.save(PistolSubcategories);
                    category.subcategories = subCats.map(ac => {
                        return ac
                    })
                    category.subcategories = subCats;
                    await categoryService.updateCategory(category.id, { name: category.name, subcategories: category.subcategories });
                }
                if (category.name == "Rifles") {
                    const subCats = await repo.save(RifleSubcategories);
                    category.subcategories = subCats.map(ac => {
                        return ac
                    })
                    category.subcategories = subCats;
                    await categoryService.updateCategory(category.id, { name: category.name, subcategories: category.subcategories });
                }
                if (category.name == "Shotguns") {
                    const subCats = await repo.save(ShotgunSubcategories);
                    category.subcategories = subCats.map(ac => {
                        return ac
                    })
                    category.subcategories = subCats;
                    await categoryService.updateCategory(category.id, { name: category.name, subcategories: category.subcategories });
                }
            })
        } catch (error) {
            console.log(error)
            // throw error
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
