const supabase = require('../config/supabase');

class ResumeController {
  async createResume(req, res) {
    const { name, content } = req.body;
    const user_id = req.user.id;
    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([{ name, content, user_id }])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getResumes(req, res) {
    const user_id = req.user.id;
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user_id);

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateResume(req, res) {
    const { id } = req.params;
    const { content, name } = req.body;
    try {
      const { data, error } = await supabase
        .from('resumes')
        .update({ content, name, updated_at: new Date() })
        .eq('id', id)
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ResumeController();
