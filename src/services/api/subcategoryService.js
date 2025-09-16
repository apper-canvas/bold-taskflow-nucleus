import { toast } from "react-toastify";

class SubcategoryService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'subcategory_c';
  }

  // Map UI field names to database field names
  mapToDatabase(subcategoryData) {
    return {
      Name: subcategoryData.name, // Required database field
      name_c: subcategoryData.name,
      category_id_c: parseInt(subcategoryData.categoryId)
    };
  }

  // Map database field names to UI field names
  mapFromDatabase(dbSubcategory) {
    return {
      Id: dbSubcategory.Id,
      name: dbSubcategory.name_c,
      categoryId: dbSubcategory.category_id_c?.Id || dbSubcategory.category_id_c,
      category: dbSubcategory.category_id_c // Full category object if populated
    };
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch subcategories:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data ? response.data.map(subcategory => this.mapFromDatabase(subcategory)) : [];
    } catch (error) {
      console.error('Error fetching subcategories:', error?.response?.data?.message || error);
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
          {"field": {"Name": "category_id_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      return this.mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching subcategory ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByCategoryId(categoryId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "category_id_c"}}
        ],
        where: [{"FieldName": "category_id_c", "Operator": "EqualTo", "Values": [parseInt(categoryId)]}],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error('Failed to fetch subcategories by category:', response.message);
        return [];
      }

      return response.data ? response.data.map(subcategory => this.mapFromDatabase(subcategory)) : [];
    } catch (error) {
      console.error('Error fetching subcategories by category:', error?.response?.data?.message || error);
      return [];
    }
  }

  async create(subcategoryData) {
    try {
      const dbData = this.mapToDatabase(subcategoryData);

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to create subcategory:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} subcategories:`, failed);
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
      console.error('Error creating subcategory:', error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, subcategoryData) {
    try {
      const dbData = this.mapToDatabase(subcategoryData);

      const params = {
        records: [{
          Id: parseInt(id),
          ...dbData
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to update subcategory:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} subcategories:`, failed);
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
      console.error('Error updating subcategory:', error?.response?.data?.message || error);
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
        console.error('Failed to delete subcategory:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} subcategories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting subcategory:', error?.response?.data?.message || error);
      return false;
    }
  }
}

export const subcategoryService = new SubcategoryService();