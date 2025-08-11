import React from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

type Props = Record<string, never>;

export default function LawSection({}: Props) {
  return (
    <section className="pt-16 pb-12 bg-[#fbf0ff]">
      <div className="max-w-4xl mx-auto gap-6 md:gap-10 flex flex-col px-4 md:px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 md:mb-0 font-roslindale text-center">
          Le bureau équipé : la nouvelle norme de l'immobilier d'entreprise
        </h2>

        <div className="w-full flex flex-col gap-8 text-gray-950">
          <p>
            Dans un marché immobilier en constante évolution, le concept de{" "}
            <strong>bureau équipé</strong> redéfinit les standards de l'espace
            de travail. Combinant{" "}
            <strong>flexibilité, services sur mesure</strong> et
            <strong>optimisation des coûts</strong>, cette approche novatrice
            répond aux besoins changeants des entreprises modernes. Découvrez
            comment le bureau équipé transforme le paysage de l'immobilier
            d'entreprise, du
            <strong>coworking à la location traditionnelle</strong>, en passant
            par les <strong>solutions hybrides</strong> et le{" "}
            <strong>bureau opéré</strong>.
          </p>

          <div className="space-y-2">
            <h3 className="text-[22px] font-bold">
              Le coworking : une révolution dans l'immobilier d'entreprise
            </h3>
            <p>
              Le{" "}
              <a href="" className="underline">
                coworking
              </a>{" "}
              a profondément transformé le paysage de l'immobilier tertiaire ces
              dernières années. Ce concept, qui signifie littéralement{" "}
              <strong>"travailler ensemble"</strong>, va bien au-delà du simple
              partage d'espace de travail. Il englobe le partage des charges,
              des espaces de conférence, de l'accueil, et de nombreux autres
              services, créant ainsi un{" "}
              <strong>
                environnement propice au progrès, à la flexibilité et à
                l'inventivité
              </strong>{" "}
              au sein des espaces de coworking. Les avantages du coworking
              incluent <strong>une plus grande productivité</strong>
              et des <strong>opportunités de networking</strong> pour les
              entrepreneurs.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold">
              Paris : épicentre de l'innovation et de la créativité
            </h4>
            <p>
              La capitale française s'est rapidement imposée comme le fer de
              lance du mouvement coworking en France. Les{" "}
              <a href="" className="underline">
                espaces de coworking à Paris
              </a>{" "}
              sont devenus des{" "}
              <strong>hubs d’ingéniosité et de renouveau</strong>, offrant des
              salles de réunion adaptées et des environnements stimulants.
              L'année 2017 a marqué un tournant décisif avec l'ouverture du
              premier espace français du géant <strong>WeWork</strong> en plein
              Quartier Central des Affaires (QCA), suivi de près par le flagship{" "}
              <strong>Morning Trudaine</strong>.
            </p>
            <p>
              Ces pionniers, rejoints par d'autres acteurs du marché, ont
              continué à innover et à ouvrir de nouveaux espaces de différentes
              tailles à travers la capitale. Ils ont su répondre aux besoins
              croissants de flexibilité et de services des entreprises, en
              proposant des solutions allant du simple poste en open space au
              plateau entier pour des équipes plus importantes, y compris des
              bureaux privés.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold">
              {" "}
              Lyon : un écosystème dynamique en pleine croissance
            </h4>
            <p>
              Suivant l'exemple parisien, le{" "}
              <a href="" className="underline">
                coworking à Lyon
              </a>{" "}
              s'est rapidement développé, offrant des{" "}
              <strong>espaces bien connectés aux transports en commun</strong>{" "}
              dans divers arrondissements de la ville. Ces espaces proposent une
              gamme complète de services, incluant des salles de collaboration
              adaptées aux besoins variés des entreprises.
            </p>
            <p>
              La métropole lyonnaise a su tirer parti de cette nouvelle tendance
              pour <strong>dynamiser son marché immobilier tertiaire</strong>.
              La mise à disposition d'espaces professionnels à Lyon est
              désormais marquée par une{" "}
              <strong>forte demande de flexibilité</strong>, avec des{" "}
              <strong>prestations de qualité</strong> et une{" "}
              <strong>excellente accessibilité via les transports</strong>.
              Cette évolution répond parfaitement aux attentes des entreprises
              modernes, qu'il s'agisse de startups en pleine croissance ou de
              grands groupes cherchant à optimiser leur présence territoriale.
            </p>
            <p>
              Le <strong>coworking</strong>, tant à Paris qu'à Lyon, a ainsi
              créé{" "}
              <strong>
                une nouvelle norme dans l'immobilier professionnel, alliant
                flexibilité, services de qualité et opportunités de networking
              </strong>
              . Cette révolution a non seulement transformé la manière dont les
              entreprises envisagent leurs espaces de travail, mais a également
              poussé les opérateurs traditionnels du marché à repenser leurs
              offres pour rester compétitifs.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-[22px] font-bold">
              La location de bureaux : vers une offre globale et flexible
            </h3>
            <p>
              L'évolution du marché de l'immobilier d'entreprise ne s'est pas
              limitée aux espaces de travail partagés. Le{" "}
              <strong>bail de locaux professionnels traditionnel</strong> a
              également connu une transformation majeure, s'adaptant aux
              nouvelles attentes des entreprises en termes de flexibilité et de
              services. L'émergence de nouvelles formes de contrats, comme le{" "}
              <strong>contrat de prestation</strong>, vient compléter l'offre du{" "}
              <strong>bail commercial classique</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold">
              Le flex-office : adapter l'espace aux nouveaux modes de travail
            </h4>
            <p>
              Le{" "}
              <a href="" className="underline">
                flex-office
              </a>
              , ou <strong>bureau flexible</strong>, est devenu un concept
              incontournable dans l'aménagement des espaces de travail modernes.
              Cette approche repose sur l'idée que{" "}
              <strong>
                les employés n'ont pas besoin d'un poste de travail attitré
              </strong>
              , mais peuvent choisir leur espace{" "}
              <strong>en fonction de leurs besoins du moment</strong>.
            </p>
            <div className="space-y-2">
              <div>Ce modèle offre plusieurs avantages :</div>
              <ul className="list-disc pl-10 space-y-2 py-2">
                <li>
                  <strong> Optimisation de l'espace</strong> : les entreprises
                  peuvent réduire leur surface de bureaux tout en accueillant le
                  même nombre d'employés.
                </li>
                <li>
                  <strong>Adaptabilité</strong> : les espaces peuvent être
                  rapidement reconfigurés selon les projets et les équipes.
                </li>

                <li>
                  <strong>Collaboration accrue</strong> : en favorisant la
                  mobilité, le flex-office encourage les interactions entre
                  collègues de différents départements.
                </li>
              </ul>
            </div>
            <p>
              Le <strong>flex-office</strong> s'est particulièrement développé
              suite à la généralisation du télétravail, permettant aux
              entreprises de s'adapter à des effectifs fluctuants sur site.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold">
              Les centres d'affaires : entre tradition et modernité
            </h4>
            <p>
              Les <strong>centres d'affaires</strong>, précurseurs de la
              flexibilité dans l'immobilier commercial,{" "}
              <strong>ont su se réinventer</strong> face à la concurrence du
              coworking. Ils proposent désormais{" "}
              <strong>une offre hybride</strong>, alliant la discrétion et le
              professionnalisme traditionnels à des services plus modernes et
              une flexibilité accrue.
            </p>
            <p>
              La{" "}
              <a href="" className="underline">
                location de bureaux
              </a>{" "}
              dans ces espaces offre des prestations variées dans différents
              secteurs, avec une excellente accessibilité aux transports. On y
              trouve des salles de réunion flexibles et des espaces de
              coworking, répondant aux besoins de flexibilité et d'efficacité
              des entreprises modernes. Cette évolution des centres d'affaires
              reflète la transformation globale du marché de l'immobilier de
              bureau.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold">
              Paris : analyse des prix au m² et tendances du marché
            </h4>
            <div className="space-y-2">
              <p>
                Les{" "}
                <a href="" className="underline">
                  bureaux à louer à Paris
                </a>{" "}
                constituent l'
                <strong>un des marchés les plus dynamiques d'Europe</strong>,
                avec des loyers variant selon les secteurs, l'accessibilité et
                les prestations offertes. Les arrondissements comme{" "}
                <strong>Montparnasse</strong> ou <strong>Madeleine</strong> sont
                particulièrement prisés pour leur centralité et leur connexion
                aux transports. Les{" "}
                <a href="" className="underline">
                  prix des bureaux à Paris
                </a>{" "}
                varient considérablement selon les arrondissements, avec des
                loyers particulièrement élevés dans le QCA (Quartier Central des
                Affaires) :
              </p>
              <ul className="list-disc pl-10 space-y-2 py-2">
                <li>
                  Dans le QCA, comprenant les 8e, 9e, 16e et 17e
                  arrondissements, les prix peuvent atteindre 900€/m²/an HT HC.
                </li>
                <li>
                  Les quartiers d'affaires émergents comme le 13e arrondissement
                  ou le Nord-Est parisien offrent des tarifs plus abordables,
                  autour de 400-500€/m²/an HT HC.
                </li>
              </ul>
            </div>
            <p>
              La tendance est à la recherche d'espaces de qualité, bien
              connectés aux transports en commun, et offrant des services
              additionnels.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-semibold">
              Lyon : un marché en pleine mutation
            </h4>
            <p>
              <strong>Lyon</strong>, deuxième marché tertiaire français après
              Paris, connaît{" "}
              <strong>une évolution rapide de son offre de bureaux</strong>. La
              {""}
              <a href="" className="underline">
                location de bureaux à Lyon
              </a>{" "}
              se caractérise par une flexibilité accrue, des prestations de
              qualité et une excellente accessibilité via les transports. Les
              loyers HT HC varient selon les secteurs, reflétant la diversité du
              marché lyonnais.
            </p>
            <div className="space-y-2">
              <p>
                Les prix de location à Lyon sont généralement plus abordables
                qu'à Paris :
              </p>

              <ul className="list-disc pl-10 space-y-2 py-2">
                <li>
                  Dans le quartier de la Part-Dieu, principal pôle tertiaire, le
                  loyer oscille entre 280 et 320€/m²/an HT HC.
                </li>
                <li>
                  Les zones périphériques comme Villeurbanne ou Vaise offrent
                  des tarifs encore plus attractifs, autour de 200-250€/m²/an HT
                  HC.
                </li>
              </ul>
            </div>
            <p>
              La <strong>demande à Lyon</strong> se porte de plus en plus sur
              des{" "}
              <strong>
                bureaux flexibles, bien équipés et situés à proximité des
                transports en commun
              </strong>
              . Les entreprises recherchent des espaces permettant d'allier
              efficacité, bien-être des employés et maîtrise des dépenses. Le
              <strong>bail commercial reste prédominant</strong>, mais de
              nouvelles formes de contrats, comme le{" "}
              <strong>
                bail commercial de courte durée, gagnent en popularité
              </strong>
              .
            </p>
            <p>
              L'
              <span>
                investissement dans l'immobilier de bureau à Lyon reste
                attractif, avec des rendements intéressants et un marché
                dynamique
              </span>
              . Les opérateurs proposent une large gamme de prestations, allant
              de la simple salle de réunion à la location de bureaux entièrement
              équipés, en passant par des solutions de bureau opéré.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-14 max-w-7xl px-4 md:px-0">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            className="py-6 text-base border-primary text-primary hover:bg-transparent hover:text-primary px-4"
          >
            Confier ma recherche
          </Button>
          <Button className="py-6 text-base px-4">
            <Search className="!size-6 mr-2" />
            Voir 8 286 annonces
          </Button>
        </div>
      </div>
    </section>
  );
}
