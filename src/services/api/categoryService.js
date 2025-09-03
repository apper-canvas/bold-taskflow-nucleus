import { toast } from 'react-toastify';

class CategoryService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category_c';
  }

  // Map UI field names to database field names
  mapToDatabase(categoryData) {
    return {
      Name: categoryData.name, // Required database field
      name_c: categoryData.name,
      color_c: categoryData.color,
      icon_c: categoryData.icon
    };
  }

  // Map database field names to UI field names
  mapFromDatabase(dbCategory) {
    return {
      Id: dbCategory.Id,
      name: dbCategory.name_c,
      color: dbCategory.color_c,
      icon: dbCategory.icon_c
    };
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch categories:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data ? response.data.map(category => this.mapFromDatabase(category)) : [];
    } catch (error) {
      console.error('Error fetching categories:', error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      return this.mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(categoryData) {
    try {
      const dbData = this.mapToDatabase(categoryData);

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to create category:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating category:', error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, categoryData) {
    try {
      const dbData = this.mapToDatabase(categoryData);

      const params = {
        records: [{
          Id: parseInt(id),
          ...dbData
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to update category:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating category:', error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to delete category:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error?.response?.data?.message || error);
      return false;
    }
  }
}

export const categoryService = new CategoryService();