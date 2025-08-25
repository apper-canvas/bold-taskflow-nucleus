import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Return a copy to prevent direct mutations
    return this.categories.map(category => ({ ...category }));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const category = this.categories.find(category => category.Id === id);
    return category ? { ...category } : null;
  }

  async create(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find the highest existing Id and add 1
    const maxId = this.categories.reduce((max, category) => 
      Math.max(max, parseInt(category.Id)), 0
    );
    
    const newCategory = {
      Id: (maxId + 1).toString(),
      ...categoryData
    };
    
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.categories.findIndex(category => category.Id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    const updatedCategory = {
      ...this.categories[index],
      ...categoryData,
      Id: id // Ensure Id remains unchanged
    };
    
    this.categories[index] = updatedCategory;
    return { ...updatedCategory };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.categories.findIndex(category => category.Id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    this.categories.splice(index, 1);
    return true;
  }
}

export const categoryService = new CategoryService();