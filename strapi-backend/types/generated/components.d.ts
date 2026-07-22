import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_card_grids';
  info: {
    description: 'Grid of content cards';
    displayName: 'Card Grid Section';
    icon: 'grid';
  };
  attributes: {
    cards: Schema.Attribute.JSON;
    columns: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
  };
}

export interface SectionsContactForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_forms';
  info: {
    description: 'Contact or enquiry form section';
    displayName: 'Contact Form Section';
    icon: 'envelop';
  };
  attributes: {
    description: Schema.Attribute.Text;
    formType: Schema.Attribute.Enumeration<
      ['contact', 'join', 'program-interest']
    > &
      Schema.Attribute.DefaultTo<'contact'>;
    heading: Schema.Attribute.String;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
  };
}

export interface SectionsCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_banners';
  info: {
    description: 'Full-width call-to-action banner';
    displayName: 'CTA Banner Section';
    icon: 'bullhorn';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.cta', false> &
      Schema.Attribute.Required;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
  };
}

export interface SectionsEmbed extends Struct.ComponentSchema {
  collectionName: 'components_sections_embeds';
  info: {
    description: 'Third-party embed (GiveLively, YouTube, etc.)';
    displayName: 'Embed Section';
    icon: 'code';
  };
  attributes: {
    embedCode: Schema.Attribute.Text;
    embedType: Schema.Attribute.Enumeration<
      ['giveLively', 'youtube', 'vimeo', 'generic']
    > &
      Schema.Attribute.DefaultTo<'generic'>;
    embedUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
  };
}

export interface SectionsFaqAccordion extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_accordions';
  info: {
    description: 'Frequently asked questions accordion';
    displayName: 'FAQ Accordion Section';
    icon: 'question';
  };
  attributes: {
    description: Schema.Attribute.Text;
    faqs: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'>;
    heading: Schema.Attribute.String;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Page hero with carousel slides';
    displayName: 'Hero Section';
    icon: 'landscape';
  };
  attributes: {
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
    slides: Schema.Attribute.Component<'shared.hero-slide', true>;
  };
}

export interface SectionsImageText extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_texts';
  info: {
    description: 'Image alongside text content';
    displayName: 'Image Text Section';
    icon: 'picture';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Component<'shared.media-alt', false>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
  };
}

export interface SectionsMap extends Struct.ComponentSchema {
  collectionName: 'components_sections_maps';
  info: {
    description: 'Interactive world map of service locations';
    displayName: 'Map Section';
    icon: 'earth';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
  };
}

export interface SectionsNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_sections_newsletters';
  info: {
    description: 'Newsletter signup form section';
    displayName: 'Newsletter Section';
    icon: 'envelop';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
    showWhatsApp: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface SectionsRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_texts';
  info: {
    description: 'Rich text content block for page builder';
    displayName: 'Rich Text Section';
    icon: 'file';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    heading: Schema.Attribute.String;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
  };
}

export interface SectionsStatistics extends Struct.ComponentSchema {
  collectionName: 'components_sections_statistics';
  info: {
    description: 'Impact statistics display';
    displayName: 'Statistics Section';
    icon: 'chartCircle';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
    stats: Schema.Attribute.Component<'shared.statistic', true>;
  };
}

export interface SectionsVideo extends Struct.ComponentSchema {
  collectionName: 'components_sections_videos';
  info: {
    description: 'Embedded or linked video block';
    displayName: 'Video Section';
    icon: 'play';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    settings: Schema.Attribute.Component<'shared.section-settings', false>;
    thumbnail: Schema.Attribute.Media<'images'>;
    videoUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: 'Call-to-action button';
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'ghost', 'donate']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_infos';
  info: {
    description: 'Contact details block';
    displayName: 'Contact Info';
    icon: 'phone';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    mapsUrl: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    description: 'Call-to-action block with primary and secondary buttons';
    displayName: 'CTA';
    icon: 'bullhorn';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false>;
    description: Schema.Attribute.Text;
    secondaryButton: Schema.Attribute.Component<'shared.button', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_slides';
  info: {
    description: 'Homepage hero carousel slide';
    displayName: 'Hero Slide';
    icon: 'landscape';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.button', false>;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: 'Navigation or inline link';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['default', 'primary', 'secondary', 'outline', 'ghost']
    > &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface SharedMediaAlt extends Struct.ComponentSchema {
  collectionName: 'components_shared_media_alts';
  info: {
    description: 'Image with accessibility metadata';
    displayName: 'Media Alt';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.String & Schema.Attribute.Required;
    caption: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface SharedMethodCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_method_cards';
  info: {
    description: 'Enable / Train / Support method card';
    displayName: 'Method Card';
    icon: 'layer';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavChild extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_children';
  info: {
    description: 'Second-level navigation item (non-recursive)';
    displayName: 'Nav Child';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String;
  };
}

export interface SharedNavItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_items';
  info: {
    description: 'Top-level navigation menu item with optional children';
    displayName: 'Nav Item';
    icon: 'bulletList';
  };
  attributes: {
    children: Schema.Attribute.Component<'shared.nav-child', true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String;
  };
}

export interface SharedPortfolioArea extends Struct.ComponentSchema {
  collectionName: 'components_shared_portfolio_areas';
  info: {
    description: 'Ministry portfolio area on homepage';
    displayName: 'Portfolio Area';
    icon: 'grid';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.link', false>;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSectionSettings extends Struct.ComponentSchema {
  collectionName: 'components_shared_section_settings';
  info: {
    description: 'Layout and visibility settings for page sections';
    displayName: 'Section Settings';
    icon: 'cog';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    backgroundColor: Schema.Attribute.Enumeration<
      ['default', 'white', 'mist', 'teal', 'dark']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    paddingBottom: Schema.Attribute.Enumeration<
      ['none', 'small', 'medium', 'large']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    paddingTop: Schema.Attribute.Enumeration<
      ['none', 'small', 'medium', 'large']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Search engine optimization metadata';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Organisation social media profiles';
    displayName: 'Social Links';
    icon: 'earth';
  };
  attributes: {
    facebook: Schema.Attribute.String;
    instagram: Schema.Attribute.String;
    linkedin: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
    youtube: Schema.Attribute.String;
  };
}

export interface SharedStatistic extends Struct.ComponentSchema {
  collectionName: 'components_shared_statistics';
  info: {
    description: 'Impact statistic with label and value';
    displayName: 'Statistic';
    icon: 'chartCircle';
  };
  attributes: {
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    prefix: Schema.Attribute.String;
    suffix: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTimelineMilestone extends Struct.ComponentSchema {
  collectionName: 'components_shared_timeline_milestones';
  info: {
    description: 'Organisation history timeline entry';
    displayName: 'Timeline Milestone';
    icon: 'clock';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'sections.card-grid': SectionsCardGrid;
      'sections.contact-form': SectionsContactForm;
      'sections.cta-banner': SectionsCtaBanner;
      'sections.embed': SectionsEmbed;
      'sections.faq-accordion': SectionsFaqAccordion;
      'sections.hero': SectionsHero;
      'sections.image-text': SectionsImageText;
      'sections.map': SectionsMap;
      'sections.newsletter': SectionsNewsletter;
      'sections.rich-text': SectionsRichText;
      'sections.statistics': SectionsStatistics;
      'sections.video': SectionsVideo;
      'shared.button': SharedButton;
      'shared.contact-info': SharedContactInfo;
      'shared.cta': SharedCta;
      'shared.hero-slide': SharedHeroSlide;
      'shared.link': SharedLink;
      'shared.media-alt': SharedMediaAlt;
      'shared.method-card': SharedMethodCard;
      'shared.nav-child': SharedNavChild;
      'shared.nav-item': SharedNavItem;
      'shared.portfolio-area': SharedPortfolioArea;
      'shared.section-settings': SharedSectionSettings;
      'shared.seo': SharedSeo;
      'shared.social-links': SharedSocialLinks;
      'shared.statistic': SharedStatistic;
      'shared.timeline-milestone': SharedTimelineMilestone;
    }
  }
}
