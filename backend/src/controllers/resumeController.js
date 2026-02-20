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

  async getResume(req, res) {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

      if (error || !data) return res.status(404).json({ error: 'Resume not found' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteResume(req, res) {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateResume(req, res) {
    const { id } = req.params;
    const { content, name } = req.body;
    const user_id = req.user.id;
    try {
      const { data, error } = await supabase
        .from('resumes')
        .update({ content, name, updated_at: new Date() })
        .eq('id', id)
        .eq('user_id', user_id)
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ResumeController();
