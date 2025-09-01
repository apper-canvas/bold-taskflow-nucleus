class TemplateService {
  constructor() {
    this.templates = [
      {
        id: 1,
        title: "Weekly Grocery Shopping",
        description: "Plan and organize your weekly grocery shopping trip with a comprehensive list",
        category: "Household",
        priority: "medium",
        isRecurring: true,
        frequency: "weekly",
        selectedDays: [6], // Saturday
        recurringTime: "10:00",
        estimatedTime: "2 hours",
        categoryId: 1
      },
      {
        id: 2,
        title: "Daily Commute Check",
        description: "Check traffic conditions and plan your route for the daily commute",
        category: "Personal",
        priority: "low", 
        isRecurring: true,
        frequency: "custom",
        selectedDays: [1, 2, 3, 4, 5], // Weekdays
        recurringTime: "07:30",
        estimatedTime: "15 mins",
        categoryId: 2
      },
      {
        id: 3,
        title: "Morning Exercise Routine",
        description: "30-minute morning workout to start your day with energy and focus",
        category: "Health",
        priority: "high",
        isRecurring: true,
        frequency: "daily",
        selectedDays: [],
        recurringTime: "06:30",
        estimatedTime: "30 mins",
        categoryId: 3
      },
      {
        id: 4,
        title: "Team Standup Meeting",
        description: "Daily team sync to discuss progress, blockers, and priorities",
        category: "Work",
        priority: "high",
        isRecurring: true,
        frequency: "custom",
        selectedDays: [1, 2, 3, 4, 5], // Weekdays
        recurringTime: "09:00",
        estimatedTime: "15 mins",
        categoryId: 4
      },
      {
        id: 5,
        title: "Weekly Meal Prep",
        description: "Prepare healthy meals for the week ahead to save time and eat better",
        category: "Health",
        priority: "medium",
        isRecurring: true,
        frequency: "weekly",
        selectedDays: [0], // Sunday
        recurringTime: "14:00",
        estimatedTime: "3 hours",
        categoryId: 3
      },
      {
        id: 6,
        title: "Monthly Budget Review",
        description: "Review expenses, income, and financial goals for the month",
        category: "Personal",
        priority: "medium",
        isRecurring: true,
        frequency: "monthly",
        selectedDays: [],
        recurringTime: "19:00",
        estimatedTime: "1 hour",
        categoryId: 2
      },
      {
        id: 7,
        title: "Weekly Learning Session",
        description: "Dedicated time for skill development and learning new technologies",
        category: "Learning",
        priority: "medium",
        isRecurring: true,
        frequency: "weekly",
        selectedDays: [2], // Tuesday
        recurringTime: "20:00",
        estimatedTime: "2 hours",
        categoryId: 5
      },
      {
        id: 8,
        title: "House Cleaning Routine",
        description: "Weekly deep cleaning session to maintain a tidy living space",
        category: "Household", 
        priority: "low",
        isRecurring: true,
        frequency: "weekly",
        selectedDays: [6], // Saturday
        recurringTime: "11:00",
        estimatedTime: "2 hours",
        categoryId: 1
      },
      {
        id: 9,
        title: "Project Planning Session",
        description: "Weekly planning session to organize tasks and set priorities for upcoming projects",
        category: "Work",
        priority: "high",
        isRecurring: true,
        frequency: "weekly",
        selectedDays: [1], // Monday
        recurringTime: "08:00",
        estimatedTime: "1 hour",
        categoryId: 4
      },
      {
        id: 10,
        title: "Digital Detox Hour", 
        description: "Daily break from screens and technology to practice mindfulness",
        category: "Health",
        priority: "medium",
        isRecurring: true,
        frequency: "daily",
        selectedDays: [],
        recurringTime: "18:00",
        estimatedTime: "1 hour",
        categoryId: 3
      },
      {
        id: 11,
        title: "Weekly Family Call",
        description: "Regular video call with family members to stay connected",
        category: "Personal",
        priority: "high",
        isRecurring: true,
        frequency: "weekly",
        selectedDays: [0], // Sunday
        recurringTime: "16:00",
        estimatedTime: "45 mins",
        categoryId: 2
      },
      {
        id: 12,
        title: "Monthly Skills Assessment",
        description: "Evaluate progress on learning goals and identify areas for improvement",
        category: "Learning",
        priority: "medium",
        isRecurring: true,
        frequency: "monthly",
        selectedDays: [],
        recurringTime: "15:00",
        estimatedTime: "1.5 hours",
        categoryId: 5
      }
    ];
  }

  async getTemplates() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.templates.map(template => ({ ...template }));
  }

  async getTemplatesByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (category === "All") {
      return this.getTemplates();
    }
    
    return this.templates
      .filter(template => template.category === category)
      .map(template => ({ ...template }));
  }

  async getTemplateById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const template = this.templates.find(t => t.id === parseInt(id));
    return template ? { ...template } : null;
  }

  // Convert template to task data format
  applyTemplate(template) {
    const now = new Date();
    const taskData = {
      title: template.title,
      description: template.description,
      priority: template.priority,
      categoryId: template.categoryId,
      isRecurring: template.isRecurring,
      frequency: template.frequency,
      selectedDays: template.selectedDays,
      recurringTime: template.recurringTime
    };

    // Set due date based on template frequency if recurring
    if (template.isRecurring) {
      const dueDate = new Date(now);
      
      if (template.frequency === "daily") {
        dueDate.setDate(dueDate.getDate() + 1);
      } else if (template.frequency === "weekly") {
        const targetDay = template.selectedDays[0] || 1;
        const daysDiff = (targetDay - dueDate.getDay() + 7) % 7;
        if (daysDiff === 0) dueDate.setDate(dueDate.getDate() + 7);
        else dueDate.setDate(dueDate.getDate() + daysDiff);
      } else if (template.frequency === "custom" && template.selectedDays.length > 0) {
        const nextDay = template.selectedDays.find(day => day > dueDate.getDay()) || 
                       template.selectedDays[0];
        const daysDiff = nextDay > dueDate.getDay() 
          ? nextDay - dueDate.getDay()
          : 7 - dueDate.getDay() + nextDay;
        dueDate.setDate(dueDate.getDate() + daysDiff);
      }
      
      taskData.dueDate = dueDate.toISOString().split('T')[0];
    }

    return taskData;
  }
}

export const templateService = new TemplateService();