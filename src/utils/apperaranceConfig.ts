import { Appearance } from '@clerk/types';

const appearanceConfig: Appearance = {
  layout: {
    helpPageUrl: "https://www.example.com/help",
    logoImageUrl: "/logo.png", // Make sure logo exists in public directory
    logoPlacement: "inside" as const,
    showOptionalFields: true,
    socialButtonsPlacement: "bottom" as const,
    socialButtonsVariant: "iconButton" as const,
    privacyPageUrl: "https://www.example.com/privacy",
    termsPageUrl: "https://www.example.com/terms"
  },
  variables: {
    colorPrimary: '#7C3AED', // Modern purple as primary color
    colorBackground: '#FFFFFF',
    colorText: '#0F172A', // Slate-900 for better readability
    colorDanger: '#DC2626',
    colorSuccess: '#059669',
    colorWarning: '#D97706',
    borderRadius: '1rem',
    spacingUnit: '1rem'
  },
  elements: {
    card: {
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.03), 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 12px 24px rgba(0, 0, 0, 0.05)',
      margin: '2rem auto',
      maxWidth: '32rem',
      border: '1px solid rgba(0, 0, 0, 0.04)',
      backdropFilter: 'blur(8px)',
    },
    formButtonPrimary: {
      backgroundColor: '#7C3AED',
      color: 'white',
      borderRadius: '1rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      padding: '0.875rem 1.5rem',
      textTransform: 'none',
      boxShadow: '0 2px 4px rgba(124, 58, 237, 0.1), 0 8px 16px rgba(124, 58, 237, 0.1)',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        backgroundColor: '#6D28D9',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(124, 58, 237, 0.2), 0 12px 24px rgba(124, 58, 237, 0.2)'
      },
      '&:active': {
        transform: 'translateY(0)',
      }
    },
    formFieldInput: {
      borderRadius: '1rem',
      border: '2px solid #E2E8F0',
      fontSize: '0.95rem',
      padding: '0.875rem 1rem',
      backgroundColor: 'white',
      transition: 'all 200ms ease',
      '&:focus': {
        borderColor: '#7C3AED',
        boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.1)',
        outline: 'none'
      },
      '&::placeholder': {
        color: '#94A3B8'
      }
    },
    formFieldLabel: {
      color: '#1E293B',
      fontSize: '0.95rem',
      fontWeight: '500',
      marginBottom: '0.5rem'
    },
    footer: {
      fontSize: '0.875rem',
      color: '#64748B',
      '& a': {
        color: '#7C3AED',
        textDecoration: 'none',
        fontWeight: '500',
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    },
    header: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#0F172A',
      textAlign: 'center',
      marginBottom: '2rem',
      lineHeight: '1.2'
    },
    socialButtons: {
      backgroundColor: '#F8FAFC',
      borderRadius: '1rem',
      border: '2px solid #E2E8F0',
      color: '#0F172A',
      fontSize: '0.95rem',
      fontWeight: '500',
      padding: '0.875rem 1rem',
      transition: 'all 200ms ease',
      '&:hover': {
        backgroundColor: '#F1F5F9',
        borderColor: '#CBD5E1'
      }
    },
    dividerLine: {
      backgroundColor: '#E2E8F0'
    },
    dividerText: {
      color: '#64748B',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    identityPreview: {
      backgroundColor: '#F8FAFC',
      borderRadius: '1rem',
      padding: '1rem',
      border: '2px solid #E2E8F0'
    },
    alert: {
      borderRadius: '1rem',
      padding: '1rem 1.25rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      '&.alert-success': {
        backgroundColor: '#F0FDF4',
        color: '#166534',
        border: '1px solid #BBF7D0'
      },
      '&.alert-error': {
        backgroundColor: '#FEF2F2',
        color: '#991B1B',
        border: '1px solid #FECACA'
      }
    },
    avatarBox: {
      backgroundColor: '#F8FAFC',
      borderRadius: '1.25rem',
      padding: '0.75rem',
      border: '2px solid #E2E8F0'
    },
    navbarButton: {
      backgroundColor: 'transparent',
      color: '#1E293B',
      fontSize: '0.95rem',
      fontWeight: '500',
      padding: '0.625rem 1rem',
      borderRadius: '0.75rem',
      transition: 'all 200ms ease',
      '&:hover': {
        backgroundColor: '#F8FAFC'
      }
    },
    profileSection: {
      backgroundColor: 'white',
      borderRadius: '1.25rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 8px 24px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.04)'
    }
  }
} as const;

export default appearanceConfig;