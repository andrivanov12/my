\\\\import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, TrendingUp, Lightbulb, Shield, Loader2, RefreshCw, Filter, Search } from 'lucide-react';
import { airtableService, AirtableArticle } from '../services/airtableService';
import AdaptiveAdBlock from '../components/AdaptiveAdBlock';

const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<AirtableArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedArticle, setSelectedArticle] = useState<AirtableArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Статические статьи как fallback
  const staticArticles: AirtableArticle[] = [
    // ... все статические статьи ...
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  // ... остальной код ...

  return (
    // ... JSX разметка ...
  );
};

export default Bloc_Page;