const supabase = require('../config/supabase');

class ResumeController {
  async createResume(req, res) {
    const { name, content } = req.body;
    const user_id = req.user.id;
    const tier = req.user.tier || 'free';
    const FREE_RESUME_LIMIT = 3;

    try {
      if (tier === 'free') {
        const { count } = await supabase.from('resumes').select('*', { count: 'exact', head: true }).eq('user_id', user_id);
        if ((count ?? 0) >= FREE_RESUME_LIMIT) {
          return res.status(403).json({ error: `Free plan limited to ${FREE_RESUME_LIMIT} resumes. Upgrade to Pro for unlimited.` });
        }
      }

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
